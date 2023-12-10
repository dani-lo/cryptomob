resource "aws_vpc" "qrated_vpc" {
    cidr_block = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support = true
    tags={
        AppProject = "qrated"
    }
}

resource "aws_subnet" "qrated_public_a" {
    vpc_id = "${aws_vpc.qrated_vpc.id}"
    cidr_block = "10.0.1.0/24"
    availability_zone = "${var.aws_region}a"
    tags={
        AppProject = "qrated"
    }
}

resource "aws_subnet" "qrated_public_b" {
    vpc_id = "${aws_vpc.qrated_vpc.id}"
    cidr_block = "10.0.2.0/24"
    availability_zone = "${var.aws_region}b"
    tags={
        AppProject = "qrated"
    }
}

resource "aws_db_subnet_group" "qrated_subnet_group" {
  name       = "qrated-subnet-group"
  subnet_ids = [
    aws_subnet.qrated_public_a.id,
    aws_subnet.qrated_public_b.id
  ]
  tags={
        AppProject = "qrated"
    }
}

resource "aws_internet_gateway" "qrated_internet_gateway" {
    vpc_id = "${aws_vpc.qrated_vpc.id}"
    tags={
        AppProject = "qrated"
    }
}

resource "aws_route" "qrated_internet_access" {
    route_table_id = "${aws_vpc.qrated_vpc.main_route_table_id}"
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.qrated_internet_gateway.id}"
}

resource "aws_security_group" "qrated_nodeapi_security_group" {
    name = "qrated-nodeapi-security-group"
    description = "Allow inbound traffic on port 8080 (http)"
    vpc_id = "${aws_vpc.qrated_vpc.id}"
    tags={
        AppProject = "qrated"
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

resource "aws_security_group" "qrated_db_security_group" {
    name = "qrated-db-security-group"
    description = "Allow inbound and outbound traffic on port 5432"
    vpc_id = "${aws_vpc.qrated_vpc.id}"
    tags={
        AppProject = "qrated"
    }
    
    ingress {
        from_port = 5432
        to_port = 5432
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 5432
        to_port = 5432
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

