import { useIsFetching } from '@tanstack/react-query'

export const GlobalLoadingIndicatorComponent = () => {
  const isFetching = useIsFetching()

  return isFetching ? (
    <div className="glob-">Queries are fetching in the background...</div>
  ) : null
}