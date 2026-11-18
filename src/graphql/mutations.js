import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!) {
    createTask(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export const COMPLETE_TASK = gql`
  mutation CompleteTask($taskId: Int!) {
    completeTask(taskId: $taskId) {
      id
    }
  }
`;
