-- Insertion de données dans la table users
INSERT INTO users (ID_19, Pseudo, Avatar)
VALUES ('ID001', 'JohnDoe', 'avatar1.jpg'),
       ('ID002', 'JaneSmith', 'avatar2.jpg'),
       ('ID003', 'RobertJohnson', 'avatar3.jpg');

-- Insertion de données dans la table fields
INSERT INTO fields (name)
VALUES ('Field 1'),
       ('Field 2'),
       ('Field 3');

-- Insertion de données dans la table conv
INSERT INTO conv (name)
VALUES ('Conversation 1'),
       ('Conversation 2'),
       ('Conversation 3');

-- Insertion de données dans la table DatasUser
INSERT INTO DatasUser (Id_user, data, Id_field, logged_at)
VALUES (1, 'Data 1', 1, '2023-06-19'),
       (2, 'Data 2', 2, '2023-06-20'),
       (3, 'Data 3', 3, '2023-06-21');

-- Insertion de données dans la table matchs
INSERT INTO matchs (Id_user1, Id_user2, score_u1, score_u2, level)
VALUES (1, 2, 10, 8, 2),
       (2, 3, 5, 3, 1),
       (3, 1, 7, 6, 3);

-- Insertion de données dans la table DataConv
INSERT INTO DataConv (Id_conv, data, Id_field, logged_at)
VALUES (1, 'Conversation data 1', 1, '2023-06-19'),
       (2, 'Conversation data 2', 2, '2023-06-20'),
       (3, 'Conversation data 3', 3, '2023-06-21');

-- Insertion de données dans la table DataMess
INSERT INTO DataMess (ID_conv, data, Id_user, logged_at)
VALUES (1, 'Message 1', 1, '2023-06-19'),
       (2, 'Message 2', 2, '2023-06-20'),
       (3, 'Message 3', 3, '2023-06-21');
