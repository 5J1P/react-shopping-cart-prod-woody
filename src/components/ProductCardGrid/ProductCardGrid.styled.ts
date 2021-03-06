import styled from 'styled-components';

export const ProductCardGridBox = styled.div`
  display: grid;
  grid-gap: 40px;
  width: max-content;

  ${({ theme: { media } }) => media.sm`
    grid-template-columns: repeat(1, minmax(0, 1fr));
  `};

  ${({ theme: { media } }) => media.md`
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `};

  ${({ theme: { media } }) => media.lg`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `};

  ${({ theme: { media } }) => media.xl`
    grid-template-columns: repeat(4, minmax(0, 1fr));
  `};
`;
