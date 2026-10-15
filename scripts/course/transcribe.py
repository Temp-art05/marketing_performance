import sys
import mlx_whisper

PROMPT = ("Khoá học UA marketing mobile app: Google Ads, Firebase, AdMob, CPI, ROAS, tROAS, tCPA, "
          "ASO, creative, first_open, ad_impression, eCPM, LTV.")

r = mlx_whisper.transcribe(sys.argv[1], path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
                           language="vi", initial_prompt=PROMPT)
with open(sys.argv[2], "w") as f:
    for s in r["segments"]:
        m, sec = divmod(int(s["start"]), 60)
        f.write(f"[{m:02d}:{sec:02d}] {s['text'].strip()}\n")
