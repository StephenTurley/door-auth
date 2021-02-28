#! /usr/bin/sh

if ! [ "$1" ]; then
  echo "first argument must be certificate name"
  exit 1
fi

if ! [ "$2" ]; then
  echo "second argument must be CA name. eg './create-signed-cert door1 ca'"
  exit 1
fi

cert="../certs/$1"
ca="../certs/$2"

echo "generating key"
openssl genrsa -out "$cert-key.pem" 4096

echo "generating signature request"
openssl req -new -key "$cert-key.pem" -out "$cert-csr.pem"

echo "signing cert"
openssl x509 -req -days 9999 -in "$cert-csr.pem" -CA "$ca-crt.pem" -CAkey "$ca-key.pem" -CAcreateserial -out "$cert-crt.pem"

echo "verifing cert"
openssl verify -CAfile "$ca-crt.pem" "$cert-crt.pem"
