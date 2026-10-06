#!/usr/bin/env bash
# Reencoda o vídeo da abertura para a web.
# Uso: scripts/encode-video.sh <video-original.mp4>
#
# -t 5.4: corta logo depois do vídeo ficar todo azul (o resto é azul parado).
# -g 1 / keyint=1: todo quadro é keyframe, então pular para qualquer currentTime
# é instantâneo e o scrub fica liso nos dois sentidos (o arquivo fica maior).
# -an: sem áudio. +faststart: o navegador começa a ler antes de baixar tudo.
set -euo pipefail
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$OUT"

encode() { # nome, largura, altura, crf
  ffmpeg -v error -y -i "$SRC" -t 5.4 -an \
    -vf "scale=$2:$3:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf "$4" -profile:v high \
    -g 1 -keyint_min 1 -sc_threshold 0 -x264-params keyint=1 \
    -movflags +faststart "$OUT/$1.mp4"
}
SRC="$1"
encode abertura 1280 720 27
encode abertura-540 960 540 28
ffmpeg -v error -y -i "$SRC" -frames:v 1 -q:v 3 "$OUT/abertura-poster.jpg"
ls -lh "$OUT"
