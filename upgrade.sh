curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
     "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:obdev/flowz_service_api_backend_flowz:dev","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=webbuilder-root"},"ports": ["3032:3032/tcp","4032:4032/tcp","80:80/tcp"],"version": "77967b36-d146-4009-9a12-5103faf1c6cb","dataVolumes":["/data:/var/www/html/websites"],"environment": {"RDB_HOST": "'"$RDB_HOST"'","RDB_PORT": "'"$RDB_PORT"'"},"toServiceStrategy":null}' \
'http://165.227.0.101:8080/v2-beta/projects/1a29/services/1s260?action=upgrade'
