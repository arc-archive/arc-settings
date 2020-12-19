import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

.sub-page-arrow {
  transform: rotate(-90deg);
}

.settings-group {
  padding: 12px;
  border: 1px #e5e5e5 solid;
  border-radius: 8px;
  margin: 40px 0; 
}

.settings-title {
  font-size: 1.6rem;
  font-weight: 300;
  margin: 1em 12px;
}

.settings-description {
  margin: 1em 12px;
}

.title-line {
  display: flex;
  align-items: center;
}

anypoint-input[type="text"] {
  width: 100%;
}
`;
