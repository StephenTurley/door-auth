#! /usr/bin/sh

if ! [ "$1" ]; then
  echo "first argument must be certificate name"
  exit 1
fi

openssl req -new -x509 -days 9999 -keyout "../certs/$1-key.pem" -out "../certs/$1-crt.pem"
