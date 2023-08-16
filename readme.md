# TODO

- Mettre toutes les variables importantes dans des fichiers env !

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

Pour acceder au site c'est [ici](http://127.0.0.1:3000), loggez vous avec vos id 19 ca sera gere !

Une doc sommaire est reprise dans le [readme](./srcs/front/README.md#architecture) du front.

Ne pas hesiter a l'agrementer (Lisa il y a une ligne pour toi pour implenter le jeu dans le front)

# Pour l'API

Un [readme](./srcs/api/README.md#routes-pour-lapi) reprend toute la doc necessaire pour comprendre la matiere.

Un [fichier sh](./srcs/api/ready.sh) est present egalement, il est execute pour faire en sorte que l'API ne demarre qu'une fois la DB entierement setup.

Pour Essayer de faire des requetes sans passer par du code, je vous conseille [Postman](https://www.postman.com/)

# Pour la DB

Un rapide descriptif est repris dans le [readme](./srcs/api/README.md#details-sur-la-db) de l'API, egalement pour la visualiser sans faire de requetes.

Il suffit de demarrer le docker et en suite de mettre dans l'URL [http://127.0.0.1:8081](http://127.0.0.1:8081).

Mettez 'postgres' dans tous les inputs et changez le type pour 'PostgreSQL' (ATTENTION: le log se coupe a chaque restart du docker).