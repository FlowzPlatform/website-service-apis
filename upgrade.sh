curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
     "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:obdev/flowz_service_api_backend_flowz:dev","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=cluster-flowz"},"ports": ["3032:3032/tcp","80:80/tcp"],"version": "da175382-a4bc-4bc9-891c-e4d550b72679","environment": {"RDB_HOST": "'"$HOST_RDB"'","RDB_PORT": "'"$PORT_RDB"'","rauth": "'"$RAUTH"'","cert": "/cacert"}}},"toServiceStrategy":null}' \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/1s260?action=upgrade'
