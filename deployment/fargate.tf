resource "aws_ecs_task_definition" "z_qrated_ecs_task_definition" {
    family = "z_qrated-nodeapi-task-family"

    // Fargate is a type of ECS that requires awsvpc network_mode
    requires_compatibilities = ["FARGATE"]
    network_mode = "awsvpc"

    // Valid sizes are shown here: https://aws.amazon.com/fargate/pricing/
    memory = "512"
    cpu = "256"

    // Fargate requires task definitions to have an execution role ARN to support ECR images
    execution_role_arn = "${aws_iam_role.z_qrated_ecs_role.arn}"
    task_role_arn = aws_iam_role.z_qrated_ecs_role.arn
    container_definitions = <<EOT
[
    {
        "name": "z_qrated-nodeapi-container",
        "image": "106314624089.dkr.ecr.eu-west-2.amazonaws.com/z_qrated-repo:latest",
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
        AppProject = "z_qrated"
    }
}

resource "aws_ecs_cluster" "z_qrated_ecs_cluster" {
    name = "z_qrated-ecs-cluster"
    tags={
        AppProject = "z_qrated"
    }
}

resource "aws_ecs_service" "z_qrated_ecs_service" {
    name = "z_qrated-ecs-service"
    tags={
        AppProject = "z_qrated"
    }

    enable_execute_command = true

    cluster = "${aws_ecs_cluster.z_qrated_ecs_cluster.id}"
    task_definition = "${aws_ecs_task_definition.z_qrated_ecs_task_definition.arn}"

    launch_type = "FARGATE"
    desired_count = 1

    

    network_configuration {
        subnets = ["subnet-0768d73fb4c3134ef"]
        security_groups = ["${aws_security_group.z_qrated_nodeapi_security_group.id}"]
        assign_public_ip = true
    }
}


