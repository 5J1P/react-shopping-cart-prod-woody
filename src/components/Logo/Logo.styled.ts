import styled from 'styled-components';

export const LogoBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  gap: 20px;
  font-size: 40px;
  font-weight: 900;
  color: inherit;

  ${({ theme: { media } }) => media.sm`
    h1 {
      display: none;
    }
  `};
`;
