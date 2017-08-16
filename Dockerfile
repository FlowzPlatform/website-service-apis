FROM ubuntu:16.04
MAINTAINER fl0wz <dm@officebrain.com>

# install dependencies
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		apache2 \
	&& rm -r /var/lib/apt/lists/*

# Default command


RUN mkdir -p /opt/app

#working directory
WORKDIR /opt/app
ADD .  /opt/app/
#COPY copy.sh .
RUN sh copy.sh

#RUN rm -f copy.sh


RUN cp -a -f apache2.conf /etc/apache2/apache2.conf
RUN cp -R -f /opt/app/projects/* /var/www/html/
#RUN cp /opt/app/.htaccess /var/www/html/dist/
#RUN cp /opt/app/vhost.conf /etc/apache2/sites-enabled/
RUN rm -rf /opt/app/*
RUN a2enmod rewrite
RUN service apache2 restart


# Ports
EXPOSE 80
CMD ["apachectl", "-D", "FOREGROUND"]

