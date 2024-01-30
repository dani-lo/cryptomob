# resource "aws_vpc" "z_qrated_vpc" {
#     cidr_block = "10.0.0.0/16"
#     enable_dns_hostnames = true
#     enable_dns_support = true
#     tags={
#         AppProject = "z_qrated"
#     }
# }

# resource "aws_subnet" "z_qrated_public_a" {
#     vpc_id = "${aws_vpc.z_qrated_vpc.id}"
#     cidr_block = "10.0.1.0/24"
#     availability_zone = "${var.aws_region}a"
#     tags={
#         AppProject = "z_qrated"
#     }
# }

# resource "aws_subnet" "z_qrated_public_b" {
#     vpc_id = "${aws_vpc.z_qrated_vpc.id}"
#     cidr_block = "10.0.2.0/24"
#     availability_zone = "${var.aws_region}b"
#     tags={
#         AppProject = "z_qrated"
#     }
# }

# resource "aws_db_subnet_group" "z_qrated_subnet_group" {
#   name       = "z_qrated-subnet-group"
#   subnet_ids = [
#     aws_subnet.z_qrated_public_a.id,
#     aws_subnet.z_qrated_public_b.id
#   ]
#   tags={
#         AppProject = "z_qrated"
#     }
# }

# resource "aws_internet_gateway" "z_qrated_internet_gateway" {
#     vpc_id = "${aws_vpc.z_qrated_vpc.id}"
#     tags={
#         AppProject = "z_qrated"
#     }
# }

# resource "aws_route" "z_qrated_internet_access" {
#     route_table_id = "${aws_vpc.z_qrated_vpc.main_route_table_id}"
#     destination_cidr_block = "0.0.0.0/0"
#     gateway_id = "${aws_internet_gateway.z_qrated_internet_gateway.id}"
# }

resource "aws_security_group" "z_qrated_nodeapi_security_group" {
    name = "z_qrated-nodeapi-security-group"
    description = "Allow inbound traffic on port 8080 (http)"
    vpc_id = "vpc-084c6f1cfd8fd17a5"
    tags={
        AppProject = "z_qrated"
    }

    ingress {
        from_port = 8080
        to_port = 8080
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# resource "aws_security_group" "z_qrated_db_security_group" {
#     name = "z_qrated-db-security-group"
#     description = "Allow inbound and outbound traffic on port 5432"
#     vpc_id = "${aws_vpc.z_qrated_vpc.id}"
#     tags={
#         AppProject = "z_qrated"
#     }
    
#     ingress {
#         from_port = 5432
#         to_port = 5432
#         protocol = "tcp"
#         cidr_blocks = ["0.0.0.0/0"]
#     }

#     egress {
#         from_port = 5432
#         to_port = 5432
#         protocol = "tcp"
#         cidr_blocks = ["0.0.0.0/0"]
#     }
# }

