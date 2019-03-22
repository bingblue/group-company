FROM nginx:alpine

LABEL maintainer="XiaoMuCOOL <gavin@bingblue.com>"

COPY ./index.html /usr/share/nginx/html/index.html
