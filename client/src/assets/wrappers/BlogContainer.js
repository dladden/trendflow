import styled from 'styled-components';

const Container = styled.main`
 background-color:  var(--white);


  .carousel-section {
    background-color: var(--white); /* gray underlay color */
    height: 40vh; /* fill the top half of the screen */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0rem;
  }

  .carousel-container {
    width: 100%;
    max-width: 1200px; /* Limit the width of the carousel */
    overflow: hidden; /* Ensure the carousel doesn't expand outside the container */
  }

  .blog-container {
    background-color: var(--white);
    padding: 20px;
  }

  .blog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .blog-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }
  /* ADMIN + CONTRIBUTORS SECTION */
  .admin-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .add-blog {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--primary);
  }

  .add-icon {
    font-size: 2rem;
    margin-right: 10px;
  }

  .admin-img, .author-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .line {
    flex: 1;
    height: 1px;
    background-color: var(--grey-50);
    margin: 0 10px;
  }

  .current-date {
    color: var(--grey-100);
  }

  .contributors {
    font-weight: bold;
    margin-right: 10px;
  }

  .author-list {
    display: flex;
    align-items: center;
  }

  /* BLOG ITEM STYLING */
  .blog-item {
    border-bottom: 1.5px solid var(--grey-50); /* line between posts */
    margin-bottom: 3rem; /* margin under each post (same in BlogPost)*/
  }
  .blog-container {
    background-color:  var(--white);
    padding: 20px;
  }

  .blog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .blog-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }

`;
export default Container;
