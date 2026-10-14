#!/usr/bin/env python3
"""
validate_coverage.py — machine check for the prd-to-visual tool.

Two gates, both deterministic and dependency-free (stdlib only):

  PARSE GATE   : is the input PRD structured enough to work with?
                 FAIL if no FR-XX heading found, OR > THRESHOLD of FRs
                 have no parseable acceptance criteria.
  COVERAGE GATE: do the generated visuals cover every FR in the PRD?
                 Each wireframe block / diagram node must be tagged with
                 the FR id it derives from (e.g. an HTML comment
                 "<!-- FR-01 -->" or "FR-01" inside a mermaid node label).

Usage:
  # parse gate only (run before rendering)
  python validate_coverage.py --prd PRD.md

  # full check (run after rendering)
  python validate_coverage.py --prd PRD.md --wireframe wireframe.html --diagram logic-diagram.html

Exit code 0 = PASS, 1 = FAIL. For .docx/.pdf, convert to text/markdown
first (via the docx / pdf skill), then point --prd at that text.
"""

import argparse
import re
import sys

# FAIL the parse gate if more than this fraction of FRs lack acceptance criteria.
AC_MISSING_THRESHOLD = 0.30

# Matches both the simple scheme (FR-01) and the per-screen scheme used by
# po-prd-writer (FR-S2-01). Kept as one pattern so PRDs from either source and
# the visuals derived from them share the SAME id vocabulary for coverage.
FR_ID = re.compile(r"\bFR-(?:S\d+-)?\d+\b")
# An FR is considered to have AC if, in its section/row, we find Given/When/Then,
# an RFC-2119 keyword (MUST/SHALL — po-prd-writer mandates these per FR), or a
# two-column "Điều kiện | Kết quả" table row.
AC_SIGNAL = re.compile(
    r"\b(Given|When|Then|MUST NOT|MUST|SHALL NOT|SHALL)\b|Điều kiện\s*\|", re.IGNORECASE
)


def fr_sort_key(fid):
    """Sort FR ids numerically across both schemes (FR-01, FR-S2-01)."""
    return [int(n) for n in re.findall(r"\d+", fid)]


def read_text(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def split_fr_sections(prd_text):
    """Return {fr_id: section_text} by slicing the PRD at each FR-XX heading."""
    lines = prd_text.splitlines()
    sections, current_id, buf = {}, None, []
    # Start a new section at a markdown heading (### FR-01) OR a table row
    # (| FR-S2-01 | ... |) — po-prd-writer lists each FR as a table row.
    heading = re.compile(r"^\s*(?:\|\s*|#{0,6}\s*)(FR-(?:S\d+-)?\d+)\b")
    for line in lines:
        m = heading.match(line)
        if m:
            if current_id:
                sections[current_id] = "\n".join(buf)
            current_id, buf = m.group(1), [line]
        elif current_id:
            buf.append(line)
    if current_id:
        sections[current_id] = "\n".join(buf)
    return sections


def parse_gate(prd_text):
    fr_ids = sorted(set(FR_ID.findall(prd_text)), key=fr_sort_key)
    if not fr_ids:
        return False, fr_ids, [], "No FR-XX heading found — PRD is not structured."

    sections = split_fr_sections(prd_text)
    missing_ac = [fid for fid in fr_ids if not AC_SIGNAL.search(sections.get(fid, ""))]
    ratio = len(missing_ac) / len(fr_ids)
    ok = ratio <= AC_MISSING_THRESHOLD
    msg = (
        f"{len(fr_ids)} FR found; {len(missing_ac)} without parseable AC "
        f"({ratio:.0%}, threshold {AC_MISSING_THRESHOLD:.0%})."
    )
    return ok, fr_ids, missing_ac, msg


def coverage_gate(prd_fr_ids, output_paths):
    covered = set()
    for p in output_paths:
        if p:
            covered |= set(FR_ID.findall(read_text(p)))
    prd_set = set(prd_fr_ids)
    missing = sorted(prd_set - covered, key=fr_sort_key)
    orphan = sorted(covered - prd_set, key=fr_sort_key)
    ok = not missing and not orphan
    return ok, covered, missing, orphan


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prd", required=True, help="PRD markdown/text file")
    ap.add_argument("--wireframe", help="generated wireframe.html")
    ap.add_argument("--diagram", help="generated logic-diagram.html")
    args = ap.parse_args()

    prd_text = read_text(args.prd)

    print("=== PARSE GATE ===")
    p_ok, fr_ids, missing_ac, p_msg = parse_gate(prd_text)
    print(p_msg)
    if missing_ac:
        print("  FR without AC:", ", ".join(missing_ac))
    if not p_ok:
        print("PARSE GATE: FAIL")
        print(">> PRD chưa đủ chuẩn. Regen bằng po-prd-writer rồi chạy lại.")
        sys.exit(1)
    print("PARSE GATE: PASS\n")

    if not (args.wireframe or args.diagram):
        print("(No outputs given — parse gate only.)")
        sys.exit(0)

    print("=== COVERAGE GATE ===")
    c_ok, covered, missing, orphan = coverage_gate(fr_ids, [args.wireframe, args.diagram])
    print(f"{len(set(fr_ids) & covered)}/{len(fr_ids)} FR covered")
    if missing:
        print("  MISSING (in PRD, not in visuals):", ", ".join(missing))
    if orphan:
        print("  ORPHAN (in visuals, not in PRD):", ", ".join(orphan))
    if not c_ok:
        print("COVERAGE GATE: FAIL")
        sys.exit(1)
    print("COVERAGE GATE: PASS")
    sys.exit(0)


if __name__ == "__main__":
    main()
