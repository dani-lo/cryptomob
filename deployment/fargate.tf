resource "aws_ecs_task_definition" "qrated_ecs_task_definition" {
    family = "qrated-nodeapi-task-family"

    // Fargate is a type of ECS that requires awsvpc network_mode
    requires_compatibilities = ["FARGATE"]
    network_mode = "awsvpc"

    // Valid sizes are shown here: https://aws.amazon.com/fargate/pricing/
    memory = "512"
    cpu = "256"

    // Fargate requires task definitions to have an execution role ARN to support ECR images
    execution_role_arn = "${aws_iam_role.qrated_ecs_role.arn}"
    task_role_arn = aws_iam_role.qrated_ecs_role.arn
    container_definitions = <<EOT
[
    {
        "name": "qrated-nodeapi-container",
        "image": "106314624089.dkr.ecr.eu-west-2.amazonaws.com/qrated-repo:latest",
        "memory": 512,
        "essential": true,
        "environmentFiles": [
                {
                    "value": "arn:aws:s3:::s3-qrated-env/node-api.env",
                    "type": "s3"
                }
            ],
        "portMappings": [
            {
                "containerPort": 8080,
                "hostPort": 8080
            }
        ]
    }
]
EOT
    tags={
        AppProject = "qrated"
    }
}

resource "aws_ecs_cluster" "qrated_ecs_cluster" {
    name = "qrated-ecs-cluster"
    tags={
        AppProject = "qrated"
    }
}

resource "aws_ecs_service" "qrated_ecs_service" {
    name = "qrated-ecs-service"
    tags={
        AppProject = "qrated"
    }

    enable_execute_command = true

    cluster = "${aws_ecs_cluster.qrated_ecs_cluster.id}"
    task_definition = "${aws_ecs_task_definition.qrated_ecs_task_definition.arn}"

    launch_type = "FARGATE"
    desired_count = 1

    

    network_configuration {
        subnets = ["${aws_subnet.qrated_public_a.id}", "${aws_subnet.qrated_public_b.id}"]
        security_groups = ["${aws_security_group.qrated_nodeapi_security_group.id}"]
        assign_public_ip = true
    }
}


