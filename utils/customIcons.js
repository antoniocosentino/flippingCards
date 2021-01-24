import { mainColor } from '../styles/styles';

export const plusSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
<g fill="none" fill-rule="evenodd">
  <circle cx="14" cy="14" r="14" fill="${ mainColor }"/>
  <g fill-rule="nonzero" transform="translate(2 2)">
    <rect width="24" height="24" fill="#000" opacity="0" transform="rotate(180 12 12)"/>
    <path fill="#FFF" d="M19,11 L13,11 L13,5 C13,4.44771525 12.5522847,4 12,4 C11.4477153,4 11,4.44771525 11,5 L11,11 L5,11 C4.44771525,11 4,11.4477153 4,12 C4,12.5522847 4.44771525,13 5,13 L11,13 L11,19 C11,19.5522847 11.4477153,20 12,20 C12.5522847,20 13,19.5522847 13,19 L13,13 L19,13 C19.5522847,13 20,12.5522847 20,12 C20,11.4477153 19.5522847,11 19,11 Z"/>
  </g>
</g>
</svg>`;

export const walletSvgBase = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
<path fill="{{color}}" fill-rule="evenodd" d="M24,8 C25.1045695,8 26,8.8954305 26,10 L26,22 C26,23.1045695 25.1045695,24 24,24 L8,24 C6.8954305,24 6,23.1045695 6,22 L6,10 C6,8.8954305 6.8954305,8 8,8 L24,8 Z M24,15 L8,15 C7.48716416,15 7.06449284,15.3860402 7.00672773,15.8833789 L7,16 L7,17 L14.2679094,17.0005962 C14.6138036,17.5980687 15.2599638,18 16,18 C16.6831104,18 17.2862317,17.657526 17.6470327,17.1349094 L17.7320906,17.0005962 L25,17 L25,16 C25,15.4871642 24.6139598,15.0644928 24.1166211,15.0067277 L24,15 Z M24,12 L8,12 C7.48716416,12 7.06449284,12.3860402 7.00672773,12.8833789 L7,13 L7,14 L25,14 L25,13 C25,12.4477153 24.5522847,12 24,12 Z M24,9 L8,9 C7.44771525,9 7,9.44771525 7,10 L7,10 L7,11 L25,11 L25,10 C25,9.44771525 24.5522847,9 24,9 L24,9 Z"/>
</svg>`;

export const challengeSvgBase = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
<g fill='none' fill-rule='evenodd'>
  <circle cx='6.5' cy='16.5' r='1.5' fill='{{color}}'/>
  <path fill='{{color}}' d='M9.557,16.1370844 L15.5941445,18.8196605 C15.852546,18.9344797 16.1474787,18.9345353 16.4059235,18.8198136 L16.4059235,18.8198136 L22.443,16.1400844 L23,20.6 L22.996,20.6 L23,20.7 C23,22.5869729 20.013455,24.1251733 16.2748651,24.1973512 L16,24.2 C12.1340068,24.2 9,22.6329966 9,20.7 C9,20.6666495 9.00093292,20.6334079 9.00278642,20.6002814 L9,20.6 L9.00845956,20.5264089 C9.01208769,20.4892677 9.01687371,20.4522785 9.02279995,20.4154503 L9.557,16.1370844 Z'/>
  <path fill='{{color}}' d='M6.60434798,11.9836019 L15.6098505,8.16541695 C15.8592169,8.05968972 16.1408049,8.05963828 16.3902099,8.16527441 L25.4048829,11.9834628 C25.9134323,12.1988602 26.1510789,12.7857349 25.9356815,13.2942843 C25.8366979,13.5279827 25.6525583,13.7153018 25.4205886,13.8182715 L16.4059235,17.8198136 C16.1474787,17.9345353 15.852546,17.9344797 15.5941445,17.8196605 L6.58863393,13.8181149 C6.08393096,13.5938531 5.85658846,13.0029104 6.08085026,12.4982074 C6.18380323,12.2665109 6.37092189,12.0825707 6.60434798,11.9836019 Z'/>
  <line x1='6.5' x2='6.5' y1='13.5' y2='16.5' stroke='{{color}}' stroke-linecap='square'/>
  <path fill='{{color}}' stroke='{{color}}' d='M6.5,19.118034 L7.19098301,20.5 L5.80901699,20.5 L6.5,19.118034 Z'/>
</g>
</svg>
`;

export const getCustomSvg = ( svgCode, color ) => svgCode.replace( /{{color}}/g, color );
