data "aws_iam_policy_document" "s3_read_permissions" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:ListBucket",
    ]

    resources = [
      "arn:aws:s3:::s3-qrated-env/*",
    ]
  }
}

data "aws_iam_policy_document" "ecs-exec-cmd" {
  statement {
    effect = "Allow"

    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]

    resources = [
      "*",
    ]
  }
}

resource "aws_iam_role" "z_qrated_ecs_role" {
  name = "z_qrated-ecs-role"
  tags={
        AppProject = "z_qrated"
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

resource "aws_iam_role_policy_attachment" "z_qrated_ecs_policy_attachment" {
  role = "${aws_iam_role.z_qrated_ecs_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  
}

resource "aws_iam_role_policy" "z_qrated-s3-read-policy" {
  name   = "z_qrated-read-env"
  role = "${aws_iam_role.z_qrated_ecs_role.name}"
  policy = data.aws_iam_policy_document.s3_read_permissions.json
}

resource "aws_iam_role_policy" "z_qrated-ecs-exec-cmd" {
  name   = "z_qrated-exec-cmd"
  role = "${aws_iam_role.z_qrated_ecs_role.name}"
  policy = data.aws_iam_policy_document.ecs-exec-cmd.json
}