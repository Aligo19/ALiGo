##############
# DATA 		 #
##############

SRCS 			=	./srcs
DOCKER			=	docker
COMPOSE 		=	docker-compose
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

# Create and start the dockers without all the details
all		:	build

# build or rebuild services
build	:
			@printf "${BLUE}%-30s${DEFAULT}${YELLOW}%-30s${DEFAULT}" "Building dockers" "in progress"
			@${COMPOSE} up --build
#			@cd srcs/ && docker-compose build
			@printf "${START_FIRST}${BLUE}%-30s%-30s${DEFAULT}\n" "Building dockers" "is done"

# Stop containers and remove containers, networks, volumes, and images created with up
down	:
			@$(COMPOSE) down

# Pause containers
pause:
			@$(COMPOSE) pause

# Unpause containers 
unpause:
			@$(COMPOSE) unpause

# down and make sure every container is deleted
clean	:
			@$(COMPOSE) down -v --rmi all --remove-orphans

# clean and make sure every volume, network and image is deleted
fclean	:	clean
			@$(DOCKER) system prune --volumes --all --force
			@$(DOCKER) network prune --force
			@rm -rf $(DATA_PATH) 
			@echo docker volume rm $(docker volume ls -q)
			@$(DOCKER) image prune --force

# $(DOCKER) volume prune --force
re		:	fclean all

.PHONY : all build down pause unpause clean fclean re show_me