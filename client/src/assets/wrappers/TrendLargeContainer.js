import styled from 'styled-components';

const Container = styled.article`
/* background: var(--primary-50); */
cursor: pointer; // Make the entire container behave like a clickable element
transition: background-color 0.3s ease; // Smooth transition for background color
&:hover {
    background-color: var(--grey-50); // Change background on hover
  }

.trend-large-link {
  display: block;
  color: inherit; /* Ensures text color is not affected by the link */
  text-decoration: none; /* Removes underline from links */
}

.trend-large-link:hover {
  cursor: pointer; /* Change cursor to indicate it's clickable */
   /* Light background on hover for feedback */
}
  
  header {
    padding: 0rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
  .info {
    h3 {
      font-size: 1.2rem;
    }
    h5 {
      font-size: 0.8rem;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      letter-spacing: var(--letter-spacing);
      color: var(--text-secondary-color);
    }
  }
  .trend-title-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .description-container{
    height: 30px;
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .content {
    flex: 1; // This will make the content section fill the available space
    display: flex; // Makes it a flex container
    flex-direction: column; // Stacks child elements vertically
    justify-content: space-between; // Distributes space around items
    padding: 1rem 1rem;
    border: 1px red;
  }
  .content-center {
  display: grid;
  grid-template-columns: repeat(2, 1fr); // Creates two columns
  grid-gap: 0.2rem; // Adds space between the grid items
  margin-top: 0.1rem;
  margin-bottom: 1rem;
}
  .info-section {
  display: flex;
  padding: 0.5rem;
  align-items: center;
  padding: 0.1rem; // Add padding inside each info section
  margin: 0.1rem; // Optionally add some margin for spacing between sections
  border-radius: 0.25rem; // Optional: rounded corners
    .icon {
      font-size: 1rem;
      margin-right: 0.4rem;
      display: flex;
      align-items: center;
    }
    .text {
      font-size: 0.9rem;
      text-transform: capitalize;
      letter-spacing: var(--letter-spacing);
      margin-bottom: 0;
    }
  }
  .actions {
    margin: 0rem 1rem 1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem; // Provides spacing between buttons when wrapped
  }
  .edit-btn svg {
  width: 1.5em;  // Icon width scales with text size
  height: 1.5em; // Icon height scales with text size
}
  /* BUTTON STYLING */
  .edit-btn,
  .action-btn,
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }
  .action-btn {
  }
  /* OVERRIDING GLOBAL BUTTON */
.btn,
.btn-color {
  color: var(--grey-600);
  cursor: pointer;
  border: none;
  border-radius: var(--button-square-radius);
  background: var(--primary-50);
  padding: 0.8rem 0.75rem;
  box-shadow: none;
  transition: var(--transition);
  text-transform: capitalize;
  display: inline-block;
}
.btn:hover {
  background: var(--grey-100);
}
.btn-color:hover {
  background: var(--primary-200);
}
.btn-hipster {
  color: var(--primary-500);
}
.btn-hipster:hover {
  color: var(--primary-200);
}
.btn-block {
  width: 100%;
}
.bookmark-btn{
  size: 30px;
  border: none;            /* Removes the border */
  background: none;        /* Optional: Removes background if desired */
  cursor: pointer;         /* Makes it clear it's clickable */
  padding: 0;              /* Optional: Adjusts padding to zero */
  outline: none;  
}
`;

export default Container;
