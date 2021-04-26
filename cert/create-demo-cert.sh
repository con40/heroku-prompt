#!/usr/bin/env bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout $SCRIPT_DIR/demo.key \
    -new \
    -out $SCRIPT_DIR/demo.crt \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat /System/Library/OpenSSL/openssl.cnf \
        <(printf '
[req]
default_bits = 2048
prompt = no
default_md = sha256
x509_extensions = v3_req
distinguished_name = dn

[dn]
C = US
ST = Washington
L = Bellevue
O = Auth0
OU = Strategic Team
emailAddress = peter@auth0.com
CN = prompt.demo

[v3_req]
subjectAltName = @alt_names

[SAN]
subjectAltName = @alt_names

[alt_names]
DNS.1 = prompt.demo
')) \
    -sha256 \
    -days 3650
