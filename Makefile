##############
# DATAS		 #
##############

SRCS 			=	./srcs
DOCKER			=	docker
COMPOSE 		=	cd srcs/ &&  docker-compose
DATA_PATH 		=	./srcs/data

##############
# ASCII DECO #
##############

DEFAULT			=	\033[0;39m
RED				=	\033[0;91m
GREEN			=	\033[0;92m
YELLOW			=	\033[0;93m
BLUE			=	\033[0;94m
BLUE_UNDERLINE	=	\033[4;34m
START_FIRST		=	\033[999D

#Create and start the dockers without all details
all		:	build up

#build or rebuild services
build	:
			@printf "${BLUE}%-30s${DEFAULT}${YELLOW}%-30s${DEFAULT}" "Building dockers" "in progress"
			@cd srcs/ && sudo docker-compose build
			@printf "${START_FIRST}${BLUE}%-30s%-30s${DEFAULT}\n" "Building dockers" "is done"

# Creates and start containers
up:
			@printf "${BLUE}%-30s${DEFAULT}${YELLOW}%-30s${DEFAULT}" "Creating dockers" "in progress"
			@${COMPOSE} up -d
			@printf "${START_FIRST}${BLUE}%-30s%-30s${DEFAULT}\n" "Creating dockers" "is done"

# Stops containers and removes containers, networks, volumes, and images created with up
down	:
			@$(COMPOSE) down

# Pause containers
pause:
			@$(COMPOSE) pause

# Unpause containers 
unpause:
			@$(COMPOSE) unpause

# down and make sure every containers are deleted
clean	:
			@$(COMPOSE) down -v --rmi all --remove-orphans

# cleans and makes sure every volumes, networks and image are deleted
fclean	:	clean
			@$(DOCKER) system prune --volumes --all --force
			@$(DOCKER) network prune --force
			@rm -rf $(DATA_PATH) 
			@echo docker volume rm $(docker volume ls -q)
			@$(DOCKER) image prune --force

# $(DOCKER) volume prune --force
re		:	fclean all

.PHONY : all build up down pause unpause clean fclean re show_me