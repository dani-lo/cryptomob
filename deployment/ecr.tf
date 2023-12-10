resource "aws_ecr_repository" "qrated_ecr_repo" {
    name = "qrated-repo"
    tags={
        AppProject = "qrated"
    }
}