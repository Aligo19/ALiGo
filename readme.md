# Liste des commandes du Makefile avec effets

| Commande make | Action | Etat |
| ------ | ------ | ------ |
| make | Genere le docker et l'execute| Cache |
| make build | Genere le docker | Cache |
| make up | Execute le docker | Cache |
| make down | Eteint le docker | Visible |
| make pause | Met le docker en pause | Visible |
| make unpause | Reactive le docker | Visible |
| make clean | Efface les dockers | |Visible 
| make fclean | Efface les volumes des dockers, les reseauz et les images| Visible |


# Pour react

Il suffit de decommenter le code dans le docker-compose et de gcl le code du frontend dans srcs en le renommant /react.

Ensuite, il faut y mettre le dockerfile "Dockerfile.react" dans le meme dossier puis le rename "Dockerfile"

Tadam on a un transcendance mdr

# Pour l'API

Un [readme](./srcs/api/README.md#routes-pour-lapi) reprend toute la doc necessaire pour comprendre la matiere.

Un [fichier sh](./srcs/api/ready.sh) est present egalement, il est execute pour faire en sorte que l'API ne demarre qu'une fois la DB entierement setup.

Pour Essayer de faire des requetes sans passer par du code, je vous conseille [Postman](https://www.postman.com/)

# Pour la DB

Un rapide descriptif est repris dans le [readme](./srcs/api/README.md#details-sur-la-db) de l'API, egalement pour la visualiser sans faire de requetes.

Il suffit de demarrer le docker et en suite de mettre dans l'URL [http://127.0.0.1:8081](http://127.0.0.1:8081).

Mettez 'postgres' dans tous les inputs et changez le type pour 'PostgreSQL' (ATTENTION: le log se coupe a chaque restart du docker).