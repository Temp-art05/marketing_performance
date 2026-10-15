#!/bin/bash
# Tải video bài học (YouTube nhúng) → transcript Whisper + khung hình, để Claude đọc rồi nạp knowledge.
#
# usage: scripts/course/video-to-notes.sh <thư mục khoá, vd raw/quocmedia-ua>
#   <dir>/lessons.tsv: mỗi dòng "index<TAB>youtube_id<TAB>thời lượng<TAB>tiêu đề"
# Ra: <dir>/video/NN_<id>.mp4, <dir>/transcript/NN_<id>.txt ([mm:ss] text),
#     <dir>/frames/NN_<id>/t_NNNN.jpg (mỗi 30s) + at_XXXXs.jpg (khi đổi cảnh).
# Bài đã xử lý thì bỏ qua → chạy lại sau khi mở khoá thêm bài là đủ.
#
# Cần: brew install ffmpeg yt-dlp; venv ~/.venvs/whisper có mlx-whisper (Apple Silicon).
# Ghi chú: YouTube đòi "Sign in to confirm you're not a bot" với client mặc định →
#   dùng player_client=web_embedded + referer trang khoá học. Giãn request để tránh HTTP 429.
set -u
D="${1:?thư mục khoá}"
REFERER="${REFERER:-https://learn.quocmedia.com/}"
PY=~/.venvs/whisper/bin/python
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$D/video" "$D/transcript" "$D/frames"

while IFS=$'\t' read -r i id _ title; do
  [ -z "$id" ] || [ "$id" = "-" ] && continue
  n=$(printf "%02d" "$i"); b="${n}_${id}"
  if [ ! -f "$D/video/$b.mp4" ]; then
    echo "↓ $b $title"
    yt-dlp -q --no-warnings --extractor-args "youtube:player_client=web_embedded" --referer "$REFERER" \
      -f "137+140/136+140/18" --merge-output-format mp4 --sleep-requests 2 \
      -o "$D/video/$b.%(ext)s" "https://www.youtube.com/watch?v=$id" || { echo "FAIL tải $b"; continue; }
    sleep 8
  fi
  v="$D/video/$b.mp4"
  if [ ! -s "$D/transcript/$b.txt" ]; then
    "$PY" -I "$HERE/transcribe.py" "$v" "$D/transcript/$b.txt" 2>/dev/null || echo "FAIL whisper $b"
  fi
  f="$D/frames/$b"
  if [ ! -d "$f" ]; then
    mkdir -p "$f/tmp"
    ffmpeg -v error -i "$v" -vf "fps=1/30,scale=1280:-1" -q:v 4 "$f/t_%04d.jpg"
    # showinfo ghi ở mức info → không dùng -v error cho lệnh này
    ffmpeg -hide_banner -i "$v" -vf "select='gt(scene,0.06)',scale=1280:-1,showinfo" -fps_mode vfr -q:v 4 \
      "$f/tmp/s_%04d.jpg" 2> "$f/tmp/info.log"
    k=1
    for t in $(grep -o 'pts_time:[0-9.]*' "$f/tmp/info.log" | cut -d: -f2); do
      s=$(printf "$f/tmp/s_%04d.jpg" $k)
      [ -f "$s" ] && mv "$s" "$(printf "$f/at_%04ds.jpg" "${t%.*}")"
      k=$((k+1))
    done
    rm -rf "$f/tmp"
  fi
  echo "✓ $b: $(wc -l < "$D/transcript/$b.txt" | tr -d ' ') dòng transcript, $(ls "$f"/*.jpg 2>/dev/null | wc -l | tr -d ' ') khung — $title"
done < "$D/lessons.tsv"
