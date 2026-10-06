#!/usr/bin/env bash
# Reencoda os vídeos originais (4K) para a web.
# Uso: scripts/encode-videos.sh <oculos-original.mp4> <esquiador-original.mp4>
#
# -g 1 / keyint=1: todo quadro é keyframe, então pular para qualquer currentTime
# é instantâneo e o scrub fica liso nos dois sentidos (o arquivo fica maior).
# -an: sem áudio (os vídeos ficam sempre mudos e pausados).
# +faststart: metadados no começo do arquivo, o navegador começa a carregar antes.
set -euo pipefail
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$OUT"

encode() { # entrada, nome, largura, altura, crf
  ffmpeg -v error -y -i "$1" -an \
    -vf "scale=$3:$4:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf "$5" -profile:v high \
    -g 1 -keyint_min 1 -sc_threshold 0 -x264-params keyint=1 \
    -movflags +faststart "$OUT/$2.mp4"
}
poster() { # entrada, nome
  ffmpeg -v error -y -i "$1" -frames:v 1 -vf "scale=1920:1080:flags=lanczos" -c:v libwebp -quality 80 "$OUT/$2-poster.webp"
}

for pair in "$1:oculos-azul" "$2:esquiador-neve"; do
  src="${pair%%:*}"; name="${pair##*:}"
  encode "$src" "$name" 1920 1080 26
  encode "$src" "$name-720" 1280 720 27
  poster "$src" "$name"
done
ls -lh "$OUT"
