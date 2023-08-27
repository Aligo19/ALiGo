# TODO

- Mettre toutes les variables importantes dans des fichiers env !

# List of Makefile commands and effects

| make command | Action | Status |
| ------ | ------ | ------ |
| make | Generate container and execute it | Cache |
| make build | Generate container | Cache |
| make up | Execute container | Cache |
| make down | Shut off the container | Visible |
| make pause | Pause the container | Visible |
| make unpause | Reactivate the container | Visible |
| make clean | Erase the containers | Visible 
| make fclean | Erase docker volumes, networks and images | Visible |

ATTENTION!!! The Makefile uses sudo, so you will have to enter your password

# About React

The website is accessible [here](http://127.0.0.1:3000), you just have to use your 42 credentials!

A brief documentation can be found in the front-end [readme](./srcs/front/README.md#architecture).

Ne pas hesiter a l'agrementer (Lisa il y a une ligne pour toi pour implenter le jeu dans le front)

# About the API

A [readme](./srcs/api/README.md#routes-pour-lapi) provides all the information needed to understand the subject.

An [sh script file](./srcs/api/ready.sh) is also provided, it prevents the API from starting until the DB has been fully set up.

[Postman](https://www.postman.com/) is recommendend to make requests without using any code.

# About the DB

A brief description is included in the API [readme](./srcs/api/README.md#details-sur-la-db), you can also visualize it without making any request.

You just have to start the container and use the URL [http://127.0.0.1:8081](http://127.0.0.1:8081).

Put 'postgres' in all fields and change the type to 'PostgreSQL' (WARNING: the login will break every time you restart the docker).