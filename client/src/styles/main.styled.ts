import { styled } from 'styled-components'

export const StyledCardContainer = styled.div<{ minw?: string}>`
  --grid-layout-gap: 10px;
  --grid-column-count: 4;
  
  ${ props => props.minw ? '--grid-item--min-width: ' + props.minw + ';': '--grid-item--min-width: 420px;' }

  /**
   * Calculated values.
   */
  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr));
  grid-gap: var(--grid-layout-gap);
`

export const StyledCard = styled.div<{ w?: string, h?: string, minw?: string}>`
    // float: left;
    position: relative;
    borderRadius: 0.25rem;

    ${ props => props.h ? 'height: ' + props.h + ';': '' }
    ${ props => props.w ? 'width: ' + props.w + ';': '' }
    ${ props => props.minw ? 'min-width: ' + props.minw + ';': '' }

    @media only screen and (max-width: 1150px) {
        min-width: 100%;
    }
`

export const StyledContainedBar = styled.div`
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: right;
`

export const StyledContainedOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #2d2a2acf;
    height: 100%;
    z-index: var(--z-1);
    display: flex;
    align-items: center;
    justify-content: center;
`