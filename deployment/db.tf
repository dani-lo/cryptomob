# resource "aws_db_instance" "qrated_postgres" {
#   engine            = "postgres"
#   allocated_storage    = 10
#   db_name              = "qrated"
#   instance_class       = "db.t3.micro"
#   skip_final_snapshot  = true
#   username = "postgres"
#   password = "postgres"
#   vpc_security_group_ids = [aws_security_group.qrated_db_security_group.id]
#   db_subnet_group_name = aws_db_subnet_group.qrated_subnet_group.name
#   tags={
#         AppProject = "qrated"
#     }
# }