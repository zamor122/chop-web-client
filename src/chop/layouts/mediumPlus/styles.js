import styled from 'styled-components';

const Container = styled.div`
  background-color: ${props => props.theme.colors.gray10};
  height: 100%;
  box-sizing: border-box;
  padding: 0 8px 0 0;
`;

const CellContainer = styled.div`
  height: calc(100% - ${props => props.bottomCell ? '8px' : '16px'});
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background};
  margin-top: ${props => props.bottomCell ? '0' : '8px'};
`;
export {
  Container,
  CellContainer,
};
