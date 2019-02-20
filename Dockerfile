FROM nginx:1.15.8-alpine
MAINTAINER "ming"
# copy conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# copy dist to nginx workspace
COPY . /usr/share/nginx/html
