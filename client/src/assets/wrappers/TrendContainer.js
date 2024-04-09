import styled from 'styled-components';

const Container = styled.article`
  /* background: var(--background-color); */
  background: var(--grey-30);
  border-radius: var(--border-radius);
  display: grid;
  grid-template-rows: 1fr auto;
  header {
    padding: 0rem;
    display: grid;
     grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
  .info {
    h5 {
      margin-bottom: 0.5rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      letter-spacing: var(--letter-spacing);
      color: var(--text-secondary-color);
    }
  }
  .content {
    padding: 1rem 1.5rem;
  }
  .content-center {
    display: flex;
    flex-direction: column;
    margin-top: 0.1;
    margin-bottom: 1.5rem;
    row-gap: 1rem; // Adjusted to manage space between rows
  }
  .info-section {
    display: flex;
    align-items: center;
    .icon {
      font-size: 1rem;
      margin-right: 1rem;
      display: flex;
      align-items: center;
    }
    .text {
      text-transform: capitalize;
      letter-spacing: var(--letter-spacing);
      margin-bottom: 0;
    }
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem; // Provides spacing between buttons when wrapped
  }
  .info-btn,
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }
  .info-btn {
    margin-right: 0.5rem;
  }
`;

export default Container;
