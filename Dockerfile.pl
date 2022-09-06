FROM perl:5.32

RUN cpanm Mojolicious
RUN cpanm Try::Tiny

WORKDIR /opt

COPY server.pl .

CMD ["perl", "server.pl", "daemon"]
