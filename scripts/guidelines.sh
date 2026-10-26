#!/usr/bin/env bash
# Static checks that keep the docs honest: the README template (~/.claude/templates/repo-docs.md),
# Fedora Magazine style rules and the store limits. Offline; reads files only. Run: npm run check:docs
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
# CHANGELOG keeps its history as written, so the style checks skip it.
mapfile -t DOCS < <(git ls-files '*.md' '.github/*.yml' '.github/ISSUE_TEMPLATE/*' | grep -v '^CHANGELOG.md$')
mapfile -t ALL_MD < <(git ls-files '*.md')

pass=0 failed=0
check() { local what=$1; shift; if "$@"; then echo "  ok: $what"; pass=$((pass + 1)); else echo "FAIL: $what" >&2; failed=$((failed + 1)); fi; }
none() { local what=$1 pat=$2; shift 2; local hits; hits=$(grep -nIE "$pat" "$@" 2>/dev/null); [ -z "$hits" ] || echo "${hits//$'\n'/$'\n'        }" | sed '1s/^/        /' >&2; check "$what" test -z "$hits"; }

echo "== README holds what the template asks for"
for h in 'Install' 'Features' 'Privacy and data' 'How it works' 'FAQ' 'Contributing' 'License'; do
  check "README has a '$h' section" grep -q "^## $h\$" README.md
done
check "README links RESOURCES-AND-GUIDE.md near the top" bash -c 'head -20 README.md | grep -q "RESOURCES-AND-GUIDE.md"'
check "README is about 100 to 160 lines" bash -c 'n=$(wc -l < README.md); [ "$n" -ge 60 ] && [ "$n" -le 160 ]'
check "README says what it costs and that results stay local" bash -c 'grep -qi "free" README.md && grep -qi "never leave your browser" README.md'

echo "== store limits"
check "manifest description is 132 characters or fewer" node -e 'process.exit(require("./apps/extension/static/manifest.json").description.length <= 132 ? 0 : 1)'

echo "== writing style"
none "no em or en dashes" $'\xe2\x80\x93|\xe2\x80\x94' "${ALL_MD[@]}"
none "no exclusionary terms" '\b(black|white)list|\bslave\b|\bmaster (branch|key|node)' "${DOCS[@]}"
none "US spelling" '\b(colour|behaviour|favourite|organis(e|ed|ing)|recognis(e|ed)|artefact|centred?|licence|initialis(e|ed)|customis(e|ed)|optimis(e|ed)|catalogue|labelled|cancelled)s?\b' "${DOCS[@]}"
none "third-party names styled as their owners do" '\bGithub\b|\bCloudFlare\b|\bFireFox\b|\bChromeium\b|\bJavascript\b|\bTypescript\b' "${DOCS[@]}"
check "headings use sentence case" python3 - "${DOCS[@]}" <<'EOF'
import re, sys
# Words that keep their capitals: names, acronyms, file names and product names.
keep = set("""MeterX Cloudflare Worker Workers Pages Firefox Chrome Chromium Edge Opera Brave Vivaldi Arc Safari
Microsoft Mozilla Google Bing Search Console GitHub Express Node npm AMO PDF CSV JSON ISP API CORS DNS SEO
TL;DR FAQ README CHANGELOG CONTRIBUTING SECURITY HANDOFF CODEMAP STATE STORE CHECKLIST PR CI I Web Store
Add-ons Partner Center Linux Android Fedora GNOME Unreleased Added Changed Fixed Removed Security Deprecated""".split())
bad = []
for f in sys.argv[1:]:
    if not f.endswith(".md"): continue
    for n, line in enumerate(open(f), 1):
        m = re.match(r"#{1,6} (.+)", line)
        if not m or re.match(r"\[\d", m.group(1)): continue
        words = re.findall(r"[A-Za-z][\w;.'-]*", re.sub(r"`[^`]*`", "", m.group(1)))[1:]
        caps = [w for w in words if w[0].isupper() and w not in keep and not w.isupper()]
        if caps: bad.append(f"        {f}:{n}: {line.strip()}  ({', '.join(caps)})")
print("\n".join(bad), file=sys.stderr)
sys.exit(1 if bad else 0)
EOF

echo "== docs hold together"
check "relative links and anchors resolve" python3 - "${ALL_MD[@]}" <<'EOF'
import os, re, sys
def slug(h): return re.sub(r"[^\w\- ]", "", re.sub(r"`", "", h).strip().lower()).replace(" ", "-")
anchors = {f: {slug(m) for m in re.findall(r"^#{1,6} (.+)$", open(f).read(), re.M)} for f in sys.argv[1:]}
bad = []
for f in anchors:
    text = re.sub(r"```.*?```", "", open(f).read(), flags=re.S)
    for target in re.findall(r"\]\(([^)\s]+)\)|(?:href|src)=\"([^\"]+)\"", text):
        t = target[0] or target[1]
        if re.match(r"[a-z]+:", t): continue
        path, _, frag = t.partition("#")
        p = os.path.normpath(os.path.join(os.path.dirname(f), path)) if path else f
        if not os.path.exists(p): bad.append(f"        {f}: missing {t}")
        elif frag and p in anchors and frag not in anchors[p]: bad.append(f"        {f}: no heading for #{frag}")
print("\n".join(bad), file=sys.stderr)
sys.exit(1 if bad else 0)
EOF
check "CHANGELOG has an Unreleased section" grep -q '^## \[Unreleased\]' CHANGELOG.md
check "SECURITY.md exists and explains how to report" grep -qi "report" SECURITY.md

echo
if [ "$failed" != 0 ]; then echo "FAIL ($failed of $((pass + failed)) checks)"; exit 1; fi
echo "PASS ($pass checks)"
