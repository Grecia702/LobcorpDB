#!/bin/bash



for f in *; do mv -- "$f" "$f.webp"; done
# BASE_URL="https://lobotomycorp.fandom.com/api.php"
# CONTINUE=""
# > urls.txt  # limpa/cria o arquivo

# INICIO=$(date +%s)

# while true; do
#   if [ -z "$CONTINUE" ]; then
#     RESPONSE=$(curl -s "$BASE_URL?action=query&list=allimages&ailimit=500&format=json")
#   else
#     RESPONSE=$(curl -s "$BASE_URL?action=query&list=allimages&ailimit=500&format=json&aicontinue=$CONTINUE")
#   fi

#   echo "$RESPONSE" | jq -r '.query.allimages[].url' | grep 'Angela' >> urls.txt

#   CONTINUE=$(echo "$RESPONSE" | jq -r '.continue.aicontinue // empty')

#   echo "URLs até agora: $(wc -l < urls.txt)"

#   if [ -z "$CONTINUE" ]; then
#     echo "Acabou! Total: $(wc -l < urls.txt) URLs"
#     break
#   fi

#   sleep 1
# done

# echo "baixando arquivos"
# wget -i urls.txt -P angela/ -nc

# FIM=$(date +%s)
# DURACAO=$((FIM - INICIO))
# echo "Tempo total: ${DURACAO}s"