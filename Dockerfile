FROM ubuntu:16.04
MAINTAINER flowz <dm@officebrain.com>

# install dependencies
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		apache2 \
	&& rm -r /var/lib/apt/lists/*

# Default command
CMD ["apachectl", "-D", "FOREGROUND"]

RUN mkdir -p /opt/DemoSite

#working directory
WORKDIR /opt/DemoSite
COPY ./projects/DemoSite/  ./
RUN sh copy.sh
RUN rm -f copy.sh


#RUN cp -a -f apache2.conf /etc/apache2/apache2.conf
RUN cp -R -f /opt/DemoSite/* /var/www/html/
#RUN cp /opt/app/.htaccess /var/www/html/dist/
#RUN cp /opt/app/vhost.conf /etc/apache2/sites-enabled/
#RUN rm -rf /opt/DemoSite/*
RUN a2enmod rewrite
RUN service apache2 restart


# Ports
EXPOSE 80
