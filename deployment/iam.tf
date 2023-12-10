resource "aws_iam_role" "qrated_ecs_role" {
  name = "qrated-ecs-role"
  tags={
        AppProject = "qrated"
    }

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "qrated_ecs_policy_attachment" {
  role = "${aws_iam_role.qrated_ecs_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  
}