import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  /* margin-top: 1rem; */
  position: relative;

  .header {
    margin-bottom: 1rem;
  }

  .email-section {
    /* display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem; */
  }
  .email-form {
  }

  //SETTINGS SECTION
 .settings-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Three equal columns */
    gap: 1rem; /* Optional: Add some space between columns */
    margin-top: 1rem;
  }

  .settings-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  //STATUS:
  .settings-item .status,
  .settings-item .privacy-switch,
  .settings-item .actions {
    display: flex;
    flex-direction: row; /* Arrange items in a row */
    align-items: center; /* Center items vertically */
    justify-content: center;
  }

.status-text {
  
}

.status-box {
  padding: 5px 10px;
  border-radius: 12px;
  display: inline-block;
}

.status-box.verified {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-box.not-verified {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

  .status,
  .privacy-switch,
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .status-text,
  .privacy-text,
  .actions-text {
    font-size: var(--small-text);
    margin-bottom: 0.5rem;
  }

  .icon {
    cursor: pointer;
    font-size: 1.5rem; /* Adjust the size as needed */
    display: flex;
    align-items: center;
  }
`;

export default Container;
