rm -Rf /var/www/qrated-review.net.apps/*

rsync -a  /home/dani/www/cryptomob/client /var/www/qrated-review.net.apps

rm -f /var/www/qrated-review.net.apps/client/.env
rm -f /var/www/qrated-review.net.apps/client/.env.local

docker-compose kill -s SIGINT

docker-compose -f /var/www/qrated-review.net.apps/client/docker-compose.yaml up