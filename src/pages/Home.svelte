<script>
  import { onMount } from 'svelte';
  import { currentLang, t } from '../lib/i18n/index.js';
  import ServiceCard from '../components/ServiceCard.svelte';
  import TestimonialCard from '../components/TestimonialCard.svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Add navigate prop
  export let navigate;

  let lang;
  let servicesVisible = false;
  let testimonialsVisible = false;
  let bookingVisible = false;
  let ctaVisible = false;
  let heroSection;

  // Subscribe to language changes
  currentLang.subscribe(value => {
    lang = value;
  });

  // Service data with SVG icons instead of image paths
  const services = [
    {
      id: 'parking',
      svgIcon: `<svg fill="#ffffff" width="219px" height="219px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,2,0V14h2a4,4,0,0,0,0-8Zm0,6H10V8h2a2,2,0,0,1,0,4ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"></path></g></svg>`,
      image: 'images/parking-lot.jpg'
    },
    {
      id: 'washing',
      svgIcon: `<svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M142.25,206.819c-11.982,0.247-23.234-6.299-28.755-17.521l-2.751-5.591H62.71l1.296-5.894 c-5.764-0.319-11.242-2.802-15.533-7.128c-4.972-5.008-8.189-12.11-9.732-21.491l-14.374,65.334l0.249,60.473 C10.504,278.339,0,291.007,0,306.138c0,17.674,14.326,32,32,32h22.252c0-39.307,31.979-71.286,71.286-71.286 c12.595,0,24.428,3.297,34.707,9.052v-69.417L142.25,206.819z"></path> </g> </g> <g> <g> <path d="M301.995,74.561c-4.888-8.729-14.137-14.15-24.14-14.15H136.613c5.117,8.867,4.418,20.507,2.632,30.824h39.416 c8.615-10.736,21.831-17.628,36.636-17.628c14.804,0,28.021,6.892,36.636,17.628h24.074l50.407,90.015 c-0.493-4.596,0.054-9.945,2.447-16.113c2.611-6.727,8.117-12.181,14.736-16.29L301.995,74.561z"></path> </g> </g> <g> <g> <path d="M352.07,260.154c-3.421-4.743-6.068-9.242-8.122-13.501l-40.47,13.681c-11.896,4.025-24.553,0.473-32.751-8.072 c0,67.969,0.052,26.197,0.052,85.876h55.885c0-27.503,15.665-51.4,38.532-63.283C360.825,271.131,356.463,266.245,352.07,260.154z "></path> </g> </g> <g> <g> <path d="M490.667,275.966c0-4.949,0-10.028,0-15.137h-23.202c-11.436,0-20.706-9.27-20.706-20.706 c0-11.436,9.27-20.706,20.706-20.706h20.006c-7.529-20.927-27.547-35.896-51.066-35.896h-20.637 c3.383,11.767,5.348,26.998-1.26,39.26c-5.568,10.331-4.45,31.472-4.45,36.857c0,2.834-0.471,5.526-1.302,8.034 c34.198,5.222,60.48,34.833,60.48,70.468c3.943,0,6.995,0,10.765,0c17.672,0,32-14.328,32-32 C512,292.206,503.094,280.36,490.667,275.966z"></path> </g> </g> <g> <g> <path d="M125.539,289.327c-26.957,0.001-48.81,21.854-48.81,48.811s21.853,48.81,48.81,48.81c13.359,0,25.459-5.371,34.272-14.066 v-69.488C150.997,294.698,138.897,289.327,125.539,289.327z M125.539,357.908c-10.919,0-19.77-8.851-19.77-19.77 s8.851-19.77,19.77-19.77c10.919,0,19.77,8.851,19.77,19.77S136.458,357.908,125.539,357.908z"></path> </g> </g> <g> <g> <path d="M397.949,289.328c-26.957,0-48.81,21.853-48.81,48.81c0,26.957,21.852,48.81,48.81,48.81 c26.957,0,48.81-21.853,48.81-48.81C446.758,311.181,424.906,289.328,397.949,289.328z M397.949,357.908 c-10.919,0-19.77-8.851-19.77-19.77s8.851-19.77,19.77-19.77s19.77,8.851,19.77,19.77S408.868,357.908,397.949,357.908z"></path> </g> </g> <g> <g> <path d="M384.574,159.738c-2.448-2.26-6.1-3.212-10.227-3.212c-11.621,0-26.995,7.553-29.773,14.712 c-1.873,4.827-1.758,8.322-0.671,11.21c13.144,0.327,24.716,8.792,28.945,21.305c4.753,14.058-1.07,29.178-13.161,36.697 c1.569,3.091,3.544,6.362,6.055,9.844c8.994,12.472,16.122,16.696,20.858,16.696c4.271,0,6.597-3.434,6.597-7.353 c0-6.78-1.437-30.186,6.469-44.854C407.572,200.115,393.916,168.361,384.574,159.738z"></path> </g> </g> <g> <g> <path d="M123.24,72.004C120.8,59.525,92.948,52.038,84.177,57.639c-13.97,8.921-3.438,18.865-9.36,29.381 c-5.923,10.516-20.068,17.661-20.289,46.903c-0.154,20.329,5.579,27.099,10.73,27.099c2.259,0,4.406-1.303,5.895-3.335 c2.548-3.478,8.601-12.716,16.538-20.826l-1.148-2.332c-7.641-15.526-1.226-34.374,14.301-42.016 c6.617-3.257,14.104-4.104,21.46-2.291C123.718,82.948,124.069,76.249,123.24,72.004z"></path> </g> </g> <g> <g> <path d="M356.879,209.151c-0.001-0.003-0.002-0.007-0.003-0.01c-2.563-7.571-10.85-11.669-18.409-9.099 c-14.502,4.902-23.759,8.033-38.712,13.087c-4.507-7.356-15.44-25.202-20.63-33.671c-7.251-11.835-20.379-19.185-34.258-19.185 c-83.287,0-60.216-0.155-94.254,0.474c-4.401-8.943-18.447-37.486-22.879-46.493c-3.565-7.248-12.34-10.118-19.448-6.62 c-7.199,3.543-10.163,12.249-6.621,19.447c16.505,33.54,11.631,23.638,26.954,54.773c2.49,5.06,7.758,8.245,13.302,8.11 c37.258-0.689,34.271-0.64,35.182-0.64c0,0.256-0.435,84.692-0.435,249.492c0,9.627,7.805,17.431,17.431,17.431 c9.625,0,17.431-7.804,17.431-17.431c0-14.798,0-110.297,0-125.829h7.526c0,15.538,0,110.994,0,125.829 c0,9.627,7.805,17.431,17.431,17.431c9.627,0,17.431-7.804,17.431-17.431c0-54.87-0.049-180.103-0.051-239.359 c0-0.709,0.471-1.331,1.153-1.524c0.682-0.193,1.41,0.09,1.781,0.694c3.083,5.025,9.717,15.869,24.234,39.564 c3.537,5.771,10.603,8.352,17.041,6.174c31.192-10.545,16.238-5.49,49.694-16.801 C355.383,224.992,359.442,216.736,356.879,209.151z"></path> </g> </g> <g> <g> <circle cx="215.299" cy="120.568" r="30.709"></circle> </g> </g> </g></svg>`,
      image: 'images/car-wash.jpg'
    },
    {
      id: 'tire',
      svgIcon: `<svg fill="#ffffff" height="238px" width="238px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M494.916,254.43C494.336,119.185,419.934,7.603,325.521,0.384l-0.008-0.008C322.278,0.128,319.019,0,315.742,0H196.275 C152.226,0,111.872,22.852,80.64,60.646l2.628-0.657l59.46-16.998c2.406-0.674,4.992-0.282,7.074,1.109l20.872,13.901 L191.539,44.1c2.543-1.707,5.811-1.903,8.55-0.538l29.739,14.865c-3.456,4.497-6.801,9.173-10.001,14.089l-22.946-11.469 l-21.478,14.319c-2.867,1.911-6.596,1.911-9.463,0l-22.315-14.882L87.689,76.467L64.87,82.176 c-3.072,4.736-6.007,9.643-8.823,14.703l9.097,7.441l20.19,13.423l20.873-13.909c2.867-1.92,6.596-1.92,9.463,0l20.873,13.901 l20.864-13.901c2.543-1.707,5.811-1.903,8.55-0.538l30.174,15.087c-2.116,5.231-4.105,10.615-5.982,16.094l-27.401-13.696 L141.269,135.1c-2.867,1.911-6.596,1.911-9.464,0l-20.864-13.909L90.069,135.1c-2.867,1.911-6.596,1.911-9.464,0l-25.6-17.067 l-6.972-5.7c-12.066,25.318-20.992,53.896-26.095,84.582l6.784-6.716l24.909-25.506c1.596-1.621,3.78-2.552,6.059-2.56 c2.185,0.068,4.471,0.887,6.084,2.5l19.567,19.558l19.567-19.558c3.328-3.337,8.73-3.337,12.066,0l19.567,19.558l19.567-19.558 c3.328-3.337,8.73-3.337,12.066,0l10.761,10.761c-1.365,6.494-2.594,13.073-3.635,19.78c-0.742-0.393-1.502-0.785-2.125-1.408 l-11.034-11.034L142.575,202.3c-3.337,3.328-8.738,3.328-12.066,0l-19.567-19.567L91.375,202.3 c-3.337,3.328-8.738,3.328-12.066,0L59.81,182.801l-18.978,19.43l-22.34,22.127c-0.247,2.816-0.469,5.641-0.648,8.491 l12.151,7.296l28.058,14.003L79.309,232.9c3.328-3.337,8.73-3.337,12.066,0l19.567,19.558l19.567-19.558 c2.765-2.765,7.066-3.294,10.419-1.289l29.841,17.903c-0.034,2.159-0.094,4.309-0.094,6.485c0,4.531,0.085,9.028,0.23,13.5 l-33.05-19.831l-20.881,20.898c-3.337,3.328-8.738,3.328-12.066,0l-19.567-19.567l-19.567,19.567 c-2.594,2.594-6.554,3.251-9.856,1.596l-34.133-17.067l-4.651-2.79c-0.009,1.237-0.06,2.458-0.06,3.695 c0,29.653,3.584,58.129,10.112,84.642l25.455-38.178c1.417-2.125,3.712-3.507,6.255-3.763c2.56-0.239,5.069,0.657,6.878,2.466 l19.567,19.558l19.567-19.558c3.328-3.337,8.73-3.337,12.066,0l19.567,19.558l19.567-19.558c3.328-3.337,8.73-3.337,12.066,0 l5.717,5.709c1.109,8.738,2.526,17.306,4.19,25.702c-1.792-0.239-3.533-0.905-4.907-2.278l-11.034-11.034l-19.567,19.567 c-3.337,3.328-8.738,3.328-12.066,0l-19.567-19.567l-19.567,19.567c-3.337,3.328-8.738,3.328-12.066,0l-18.244-18.244 L33.297,362.24c3.499,10.906,7.518,21.402,12.015,31.42l8.875-7.603l16.589-16.623c3.328-3.336,8.73-3.336,12.066,0 l19.567,19.558l19.567-19.558c3.328-3.336,8.73-3.336,12.066,0l18.236,18.236l11.298-16.939 c2.381-3.575,7.066-4.821,10.914-2.901l14.797,7.398c2.705,8.124,5.709,15.966,8.934,23.552l-24.627-12.314l-12.885,19.328 c-1.417,2.125-3.721,3.507-6.263,3.763c-2.586,0.222-5.069-0.657-6.869-2.458l-19.567-19.567L108.442,407.1 c-3.337,3.328-8.738,3.328-12.066,0l-19.567-19.567l-11.034,11.034l-12.8,10.974c9.779,18.577,21.308,35.157,34.193,49.34 l10.948-5.478l25.156-16.768c2.867-1.92,6.596-1.92,9.463,0l20.873,13.901l20.864-13.901c2.867-1.92,6.596-1.92,9.463,0 l20.873,13.901l15.386-10.249c3.174,4.847,6.502,9.464,9.924,13.892L209.536,467.9c-2.867,1.911-6.596,1.911-9.464,0 l-20.864-13.909L158.336,467.9c-2.867,1.911-6.596,1.911-9.464,0l-20.864-13.909L107.136,467.9 c-0.29,0.196-0.597,0.375-0.913,0.529l-6.366,3.183C127.718,497.126,160.794,512,196.275,512h119.467 c2.944,0,5.939-0.119,8.969-0.35h0.009c0.213,0,0.435,0,0.649-0.017c4.198-0.324,8.644-0.939,13.508-1.835 c75.699-13.892,137.464-95.036,152.576-203.315c2.159-16.521,3.328-33.485,3.473-50.483 C494.925,255.991,494.916,254.438,494.916,254.43z M474.547,304.188c-14.319,102.519-72.149,178.671-142.14,189.278 c-2.611,0.401-5.239,0.853-7.799,1.075c-0.179-0.017-0.35-0.051-0.529-0.068c-2.492-0.247-4.966-0.597-7.424-1.05 c-0.862-0.162-1.707-0.367-2.568-0.546c-1.801-0.384-3.593-0.802-5.367-1.289c-0.939-0.265-1.877-0.538-2.807-0.828 c-1.724-0.538-3.439-1.118-5.146-1.758c-0.87-0.316-1.749-0.631-2.611-0.981c-1.963-0.794-3.9-1.656-5.828-2.577 c-0.555-0.265-1.126-0.503-1.681-0.776c-2.517-1.254-5.018-2.62-7.475-4.088c-0.299-0.179-0.58-0.384-0.879-0.563 c-2.142-1.314-4.258-2.697-6.349-4.164c-0.623-0.435-1.246-0.905-1.86-1.357c-1.792-1.306-3.567-2.662-5.316-4.079 c-0.614-0.495-1.229-0.998-1.835-1.51c-1.852-1.553-3.678-3.174-5.478-4.855c-0.427-0.393-0.853-0.776-1.28-1.178 c-6.886-6.571-13.406-14.037-19.507-22.315c-0.205-0.282-0.41-0.572-0.623-0.853c-1.852-2.551-3.678-5.171-5.453-7.868 c-0.179-0.273-0.35-0.538-0.529-0.802c-7.859-12.049-14.908-25.506-20.992-40.132c-0.401-0.973-0.802-1.937-1.195-2.918 c-1.903-4.71-3.703-9.54-5.393-14.472c-0.017-0.034-0.026-0.068-0.034-0.102c-1.69-4.915-3.268-9.933-4.745-15.053 c-0.017-0.043-0.026-0.085-0.043-0.128c-1.434-4.984-2.756-10.078-3.985-15.249c-0.111-0.461-0.213-0.939-0.324-1.399 c-1.152-4.949-2.219-9.975-3.174-15.078c-0.034-0.196-0.077-0.384-0.111-0.58c-0.947-5.103-1.775-10.3-2.517-15.539 c-0.137-0.93-0.256-1.86-0.375-2.79c-0.666-4.966-1.254-9.975-1.732-15.053c-0.026-0.29-0.06-0.58-0.085-0.879 c-0.478-5.205-0.819-10.479-1.084-15.795c-0.06-1.229-0.111-2.466-0.162-3.703c-0.222-5.35-0.367-10.726-0.367-16.162 c0-3.968,0.06-7.919,0.171-11.836c0.043-1.254,0.119-2.483,0.171-3.729c0.102-2.662,0.196-5.325,0.35-7.97 c0.102-1.647,0.247-3.268,0.367-4.907c0.162-2.202,0.299-4.42,0.495-6.613c0.179-1.963,0.41-3.9,0.614-5.854 c0.188-1.835,0.358-3.686,0.572-5.504c0.23-1.92,0.512-3.806,0.776-5.717c0.247-1.818,0.469-3.652,0.734-5.461 c0.282-1.852,0.614-3.678,0.922-5.513c0.299-1.818,0.58-3.661,0.904-5.461c0.341-1.869,0.734-3.703,1.101-5.555 c0.341-1.732,0.666-3.482,1.033-5.197c0.41-1.937,0.87-3.823,1.314-5.734c0.375-1.596,0.717-3.217,1.109-4.796 c0.478-1.946,1.007-3.857,1.519-5.777c0.401-1.502,0.777-3.029,1.195-4.514c0.538-1.903,1.118-3.763,1.681-5.632 c0.444-1.468,0.862-2.953,1.323-4.403c0.58-1.843,1.212-3.635,1.818-5.453c0.486-1.434,0.947-2.901,1.451-4.318 c0.674-1.911,1.399-3.763,2.099-5.641c0.486-1.271,0.939-2.569,1.434-3.823c0.776-1.971,1.596-3.891,2.398-5.82 c0.469-1.118,0.913-2.261,1.391-3.362c0.828-1.903,1.698-3.746,2.552-5.606c0.503-1.084,0.981-2.202,1.502-3.277 c0.862-1.818,1.775-3.575,2.671-5.35c0.546-1.067,1.058-2.159,1.613-3.208c0.922-1.749,1.877-3.448,2.833-5.154 c0.563-1.015,1.109-2.057,1.69-3.063c0.956-1.655,1.946-3.26,2.935-4.872c0.606-0.998,1.195-2.022,1.809-2.995 c1.007-1.587,2.048-3.115,3.081-4.659c0.631-0.947,1.246-1.911,1.886-2.842c1.067-1.536,2.167-3.012,3.26-4.497 c0.64-0.87,1.263-1.766,1.911-2.62c1.118-1.468,2.27-2.876,3.422-4.292c0.648-0.811,1.289-1.647,1.946-2.432 c1.178-1.399,2.381-2.731,3.584-4.079c0.666-0.742,1.314-1.519,2.056-2.185c0.734-0.666,1.451-1.357,2.185-2.005 c1.28-1.109,2.586-2.15,3.883-3.2c0.742-0.606,1.468-1.237,2.219-1.818c1.323-1.024,2.679-1.971,4.028-2.935 c0.742-0.538,1.485-1.109,2.236-1.621c1.331-0.913,2.697-1.741,4.053-2.586c0.794-0.495,1.579-1.033,2.372-1.502 c1.357-0.802,2.739-1.527,4.113-2.261c0.819-0.444,1.63-0.913,2.449-1.331c1.417-0.478,2.859-0.862,4.284-1.271c0.896-0.256,1.783-0.546,2.679-0.776c1.417-0.358,2.859-0.623,4.284-0.913 c0.93-0.196,1.86-0.418,2.79-0.58c1.425-0.247,2.867-0.401,4.301-0.58c0.905-0.111,1.792-0.256,2.697-0.333 c85.248,7.1,152.329,110.993,152.866,236.851l0.009,1.604C477.722,272.171,476.604,288.427,474.547,304.188z"></path> <path d="M252.855,151.971c-0.282-0.273-0.538-0.572-0.785-0.887l-3.081-4.019c-11.708,30.541-18.586,67.959-18.586,108.928 c0,40.747,6.801,77.995,18.389,108.442l3.763-4.105c17.493-17.263,29.047-59.076,29.047-104.337 C281.604,210.74,270.05,168.927,252.855,151.971z"></path> <path d="M332.806,68.262c-30.49,0-57.378,23.39-75.981,60.954l8.448,11.042c20.309,20.48,33.399,65.784,33.399,115.738 c0,50.313-13.278,95.906-33.835,116.173l-8.61,9.404c18.62,38.272,45.764,62.157,76.578,62.157 c57.421,0,102.4-82.458,102.4-187.733S390.227,68.262,332.806,68.262z"></path> </g> </g> </g> </g></svg>`,
      image: 'images/merc-tyre.jpg'
    },
    {
      id: 'service',
      svgIcon: `<svg fill="#ffffff" width="223px" height="223px" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" id="car-repair"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.6,8.7,11.5,6.5a1.05,1.05,0,0,0-.9-.5H4.4a1.05,1.05,0,0,0-.9.5L2.4,8.7,1.16,9.852a.5.5,0,0,0-.16.367V14.5a.5.5,0,0,0,.5.5h2c.2,0,.5-.2.5-.4V14h7v.5c0,.2.2.5.4.5h2.1a.5.5,0,0,0,.5-.5V10.219a.5.5,0,0,0-.16-.367ZM4.5,7h6l1,2h-8ZM5,11.6c0,.2-.3.4-.5.4H2.4c-.2,0-.4-.3-.4-.5V10.4c.1-.3.3-.5.6-.4l2,.4c.2,0,.4.3.4.5Zm8-.1c0,.2-.2.5-.4.5H10.5c-.2,0-.5-.2-.5-.4v-.7c0-.2.2-.5.4-.5l2-.4c.3-.1.5.1.6.4ZM14,2V3a1.009,1.009,0,0,1-1.017,1H5.348A2.549,2.549,0,0,1,1,3.5H3.5v-2H1A2.549,2.549,0,0,1,5.348,1h7.635A1.009,1.009,0,0,1,14,2Z"></path> </g></svg>`,
      image: 'images/workshop.jpg'
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Csilla Demcsák',
      location: '',
      text: 'Nagyon profik. Fiatalok, energikusak, jó áron dolgoznak! Nagyon szép és kényelmes volt, hogy a javítást, a gumijavítást és az autótisztítást egyben elvégezhettem.',
      image: null
    },
    {
      id: 2,
      name: 'Helyi idegenvezető',
      location: '',
      text: 'Minden dicséret a tulajnak, kivitt minket a reptérre és vissza a parkolóba. Problémánk volt az autón a kerékkel, amit a tulajdonos segítségével megoldottunk. Még egyszer köszönöm és minden ajánlást ehhez a parkolóhoz.',
      image: null
    },
    {
      id: 3,
      name: 'Kubilay Öztürk',
      location: '',
      text: 'Minden gördülékeny volt, ajánlom őket!!',
      image: null
    }
  ];

  // Handler for service card CTA buttons
  function handleServiceAction(serviceId) {
    // Navigate to services section
    navigate('services');
    // Note: Scrolling to specific service ID after navigating to #services
    // might require additional logic depending on your routing setup.
    // The navigate function likely handles scrolling to the main #services anchor.
  }

  // Removed the scrollToNextSection function as navigate will be used
  // function scrollToNextSection() {
  //   const viewportHeight = window.innerHeight;
  //   window.scrollTo({
  //     top: viewportHeight,
  //     behavior: 'smooth'
  //   });
  // }


  onMount(() => {
    // Setup parallax effect for hero section
    

    // Setup animations with ScrollTrigger

    // Booking section animation
    gsap.from('.booking-container', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.booking-section',
        start: 'top 80%',
        onEnter: () => {
          bookingVisible = true;
        }
      }
    });

    // Services section animation (handled by the shouldAnimate prop)
    const servicesSection = document.querySelector('.services-section');
    if (servicesSection) {
      ScrollTrigger.create({
        trigger: servicesSection,
        start: 'top 70%',
        onEnter: () => {
          servicesVisible = true;
        }
      });
    }

    // Testimonials section animation
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
      ScrollTrigger.create({
        trigger: testimonialsSection,
        start: 'top 70%',
        onEnter: () => {
          testimonialsVisible = true;
        }
      });
    }

    // CTA section animation
    gsap.from('.cta-content', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        onEnter: () => {
          ctaVisible = true;
        }
      }
    });
  });
</script>

<section class="hero" bind:this={heroSection}>
  <div class="hero-background"></div>
  <div class="hero-overlay"></div>
  <div class="container hero-container">
    <div class="hero-content">
      <h1>{$currentLang === 'hu' ? 'Üdvözöljük a Zima Auto Kft-nél!' : 'Welcome to Zima Auto!'}</h1>
      <p>{$currentLang === 'hu'
        ? 'Ahol az autója minden igényére egy helyen kínálunk megoldást!'
        : 'Where we offer solutions for all your car needs in one place!'}</p>
      <button class="btn btn-primary" on:click={() => navigate('booking')}>
        {$currentLang === 'hu' ? 'FOGLALJON MOST' : 'BOOK NOW'}
      </button>
    </div>

    <div
      class="scroll-down-indicator"
      on:click={() => {
        const nextSection = document.querySelector('.booking-section');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          const nextSection = document.querySelector('.booking-section');
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }}
      tabindex="0"
      role="button"
      aria-label={$currentLang === 'hu' ? 'Görgessen lefelé' : 'Scroll down'}
    >
      <span>{$currentLang === 'hu' ? 'Görgessen lefelé' : 'Scroll down'}</span>
      <div class="scroll-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </div>
</section>

<section class="booking-section" id="booking">
  <div class="container">
    <h2 class="section-title">{$currentLang === 'hu' ? 'FOGLALJON HELYET' : 'BOOK A SPOT'}</h2>

    <div class="booking-container">
      <div class="booking-image">
        <img src="images/zima-gate.JPG" alt="Airport Parking" loading="lazy" />
      </div>
      <div class="booking-content">
        <p class="booking-description">
          {$currentLang === 'hu'
            ? 'Foglaljon biztonságos parkolóhelyet már ma! Garantált helyek, 24/7 felügyelet, ingyenes reptéri transzfer.'
            : 'Book your secure parking spot today! Guaranteed spaces, 24/7 surveillance, free airport transfer.'}
        </p>
         <button class="btn btn-primary booking-btn" on:click={() => navigate('booking')}>
          {$currentLang === 'hu' ? 'Reptéri Parkolás Foglalása' : 'Book Airport Parking'}
        </button>
      </div>
    </div>
  </div>
</section>

<section class="services-section" id="services"> 
  <div class="wave-top">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 20" preserveAspectRatio="none">
      <path fill="#ffffff" fill-opacity="1" d="M0,0L1440,0L1440,0L0,0Z"></path>
    </svg>
  </div>

  <div class="container">
    <h2 class="section-title">{$currentLang === 'hu' ? 'SZOLGÁLTATÁSOK' : 'OUR SERVICES'}</h2>
    <p class="section-subtitle">
      {$currentLang === 'hu'
        ? 'Fedezze fel átfogó szolgáltatásainkat, melyek az Ön járművének minden igényét kielégítik'
        : 'Discover our comprehensive services covering all your vehicle needs in one place'}
    </p>

    <div class="services-grid">
      {#each services as service, i}
        <ServiceCard
          svgIcon={service.svgIcon}
          image={service.image}
          title={$currentLang === 'hu'
            ? (service.id === 'parking' ? '24/7 REPÜLŐTÉRI PARKOLÁS' :
               service.id === 'washing' ? 'AUTÓMOSÓ' :
               service.id === 'tire' ? 'GUMISZERIVZ' : 'AUTÓSZERVIZ')
            : (service.id === 'parking' ? '24/7 AIRPORT PARKING' :
               service.id === 'washing' ? 'CAR WASH' :
               service.id === 'tire' ? 'TIRE SERVICE' : 'AUTO SERVICE')
          }
          description={$currentLang === 'hu'
            ? (service.id === 'parking' ? 'Biztonságos parkolási lehetőségünk bekerített határokkal és 24 órás kamerás megfigyeléssel rendelkezik, ami garantálja járművének a legnagyobb biztonságot.' :
               service.id === 'washing' ? 'Ajándékozza meg járművét egy fürdőnappal professzionális autómosó szolgáltatásainkkal, amelyek célja, hogy autója csillogóan tisztán és fiatalon maradjon.' :
               service.id === 'tire' ? 'Szakértő technikusaink készen állnak az abroncsokkal kapcsolatos bármilyen probléma azonnali megoldására, és biztonságosan visszatérni az útra.' :
               'A rutinellenőrzéstől a komplex javításokig szakképzett szerelőink fel vannak szerelve az összes karbantartás elvégzésére.')
            : (service.id === 'parking' ? 'Our secure parking facility features fenced boundaries and 24-hour camera surveillance, guaranteeing the highest security for your vehicle.' :
               service.id === 'washing' ? 'Treat your vehicle to a spa day with our professional car washing services aimed at keeping your car looking sparkling clean and youthful.' :
               service.id === 'tire' ? 'Our expert technicians are ready to solve any tire-related problems immediately and get you safely back on the road.' :
               'From routine checks to complex repairs, our qualified mechanics are equipped to perform all maintenance.')
          }
          index={i}
          shouldAnimate={servicesVisible}
          ctaText={$currentLang === 'hu' ? 'Részletek' : 'Details'}
          ctaAction={() => handleServiceAction(service.id)}
        />
      {/each}
    </div>
  </div>

  <div class="wave-bottom">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 20" preserveAspectRatio="none">
      <path fill="#141a25" fill-opacity="1" d="M0,20L1440,20L1440,20L0,20Z"></path>
    </svg>
  </div>
</section>

<section class="testimonials-section">
  <div class="background-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>

  <div class="container">
    <h2 class="section-title">
      {$currentLang === 'hu' ? 'Ügyfeleink Véleménye' : 'Customer Testimonials'}
    </h2>

    <div class="testimonials-grid">
      {#each testimonials as testimonial, i}
        <TestimonialCard
          name={testimonial.name}
          location={testimonial.location}
          text={testimonial.text}
          image={testimonial.image}
          index={i}
          isVisible={testimonialsVisible}
        />
      {/each}
    </div>

    <div class="testimonials-footer">
      <button class="btn btn-outline">
        {$currentLang === 'hu' ? 'További vélemények' : 'More testimonials'}
      </button>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <div class="cta-content">
      <h2>{$currentLang === 'hu' ? 'Fedezze fel versenyképes árainkat – nézze meg most!' : 'Discover our competitive prices – check them out now!'}</h2>
      <button class="btn btn-outline" on:click={() => navigate('services')}>
        {$currentLang === 'hu' ? 'Árlista Megtekintése' : 'View Price List'}
      </button>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
  .hero {
    height: 100vh;
    min-height: 600px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    overflow: hidden;
  }

  .hero-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
    z-index: 0;
    background-image: url('/images/airport-car.webp');
    will-change: transform;
  }

  .hero-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.4) 100%
    );
    z-index: 1;
  }

  .hero-container {
    position: relative;
    z-index: 2;
    padding: 0 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .hero-content {
    text-align: center;
    z-index: 2;
    max-width: 1200px;
    padding: 0 2rem;
  }

  .hero-content h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hero-content p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    line-height: 1.4;
  }

  .hero-content .btn {
    font-size: 1.1rem;
    padding: 1rem 2.5rem;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .hero-content .btn:hover,
  .hero-content .btn:focus {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: var(--primary-dark);
    outline: none;
  }

  /* Scroll down indicator */
  .scroll-down-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    cursor: pointer;
    transition: opacity 0.3s ease;
    opacity: 0.8;
    z-index: 3;
  }

  .scroll-down-indicator:hover,
  .scroll-down-indicator:focus {
    opacity: 1;
    outline: none;
  }

  .scroll-down-indicator:focus {
    outline: 2px solid var(--primary);
    outline-offset: 4px;
    border-radius: 4px;
  }

  .scroll-down-indicator span {
    font-size: 0.9rem;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }

  .scroll-arrow svg {
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  /* Booking Section */
  .booking-section {
    padding: 6rem 2rem;
    background-color: #ffffff;
    position: relative;
  }

  .section-title {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 2.2rem;
    position: relative;
  }

  .section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--primary);
  }

  .section-subtitle {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 3rem;
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .booking-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    max-width: 1000px;
    margin: 0 auto;
    background-color: #f8f9fa;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .booking-image {
    flex: 1.2;
    overflow: hidden;
  }

  .booking-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .booking-container:hover .booking-image img {
    transform: scale(1.05);
  }

  .booking-content {
    flex: 0.8;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .booking-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #555;
    margin-bottom: 2rem;
  }

  .booking-btn {
    align-self: center;
    font-size: 1rem;
    padding: 0.8rem 2rem;
     /* Inherits primary button styles but explicit for clarity */
     background-color: var(--secondary);
     color: white;
     border: none;
     border-radius: 5px;
     cursor: pointer;
     transition: all 0.3s ease;
  }

  .booking-btn:hover,
  .booking-btn:focus {
     transform: translateY(-3px);
     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
     background-color: var(--primary-dark);
     outline: none;
  }


  /* Services Section */
  .services-section {
    padding: 6rem 2rem;
    background-color: #f8f9fa;
    position: relative;
  }

  /* Simplified waves for better mobile performance */
  .wave-top, .wave-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    height: 20px;
    overflow: hidden;
    line-height: 0;
  }

  .wave-top {
    top: 0;
    transform: translateY(-1px); /* Ensure no gaps */
  }

  .wave-bottom {
    bottom: 0;
    transform: translateY(1px); /* Ensure no gaps */
  }

  .wave-top svg, .wave-bottom svg {
    width: 100%;
    height: 100%;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  /* Testimonials Section */
  .testimonials-section {
    padding: 6rem 2rem;
    background-color: #141a25;
    color: white;
    position: relative;
    overflow: hidden;
  }

  /* Background shapes */
  .background-shapes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.05;
  }

  .shape-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #00bae5, #0088cc);
    top: -250px;
    right: -100px;
  }

  .shape-2 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #0088cc, #004466);
    bottom: -300px;
    left: -150px;
  }

  .shape-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #00bae5, #004466);
    top: 40%;
    right: 10%;
  }

  .testimonials-section .container {
    position: relative;
    z-index: 2;
  }

  .testimonials-section .section-title {
    margin-bottom: 3.5rem;
    font-size: 2.6rem;
    color: white;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .testimonials-section .section-title::after {
    background: linear-gradient(to right, #00bae5, #0088cc);
    height: 3px;
    width: 60px;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
  }

  .testimonials-footer {
    margin-top: 3rem;
    text-align: center;
  }

.testimonials-footer .btn {
    background-color: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.8rem 2rem;
    transition: all 0.3s ease;
  }

  .testimonials-footer .btn:hover {
    background-color: var(--primary);
    border-color: var(--primary);
    transform: translateY(-3px);
  }

  /* CTA Section */
  .cta-section {
    padding: 5rem 2rem;
    background-color: #13151a;
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cta-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(30, 10, 60, 0.95), rgba(13, 13, 30, 0.9));
    z-index: 0;
  }

  .cta-content {
    position: relative;
    z-index: 1;
  }

  .cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-section .btn {
    font-size: 1rem;
    padding: 1rem 2rem;
    border: 2px solid white;
    background-color: transparent;
    color: white;
    transition: all 0.3s ease;
     /* Inherit primary button styles if available, or define specific ones */
  }

  .cta-section .btn:hover {
    background-color: white;
    color: #13151a;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  /* Responsive Styles - Optimized for mobile */
  @media screen and (max-width: 1200px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    .testimonials-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 992px) {
    .booking-container {
      flex-direction: column;
      max-width: 600px;
    }

    .booking-image {
      width: 100%;
      height: 250px;
    }

    .booking-content {
      width: 100%;
      padding: 2rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .testimonials-section .section-title {
      font-size: 2.2rem;
    }

    .cta-section h2 {
      font-size: 2rem;
    }
  }

  @media screen and (max-width: 768px) {
    .hero {
      min-height: 500px;
    }
    .hero-content h1 {
      font-size: 2.8rem;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }

    .hero-content p {
      font-size: 1.4rem;
    }

    .scroll-down-indicator {
      bottom: 20px;
    }

    .services-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .testimonials-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .section-title {
      font-size: 2.2rem;
    }

    .section-subtitle {
      font-size: 1.2rem;
    }

    .testimonials-section .section-title {
      font-size: 2.2rem;
    }

    .cta-section h2 {
      font-size: 2.2rem;
    }

    .services-section,
    .testimonials-section,
    .booking-section {
      padding: 4rem 1.5rem;
    }

    .wave-top, .wave-bottom {
      height: 10px;
    }
  }

  @media screen and (max-width: 480px) {
    .hero {
      min-height: 400px;
    }
    .hero-content h1 {
      font-size: 2.4rem;
    }

    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .hero-content .btn {
      font-size: 1.1rem;
      padding: 0.8rem 2rem;
    }

    .booking-section, .services-section, .testimonials-section, .cta-section {
      padding: 3rem 1rem;
    }

    .wave-top, .wave-bottom {
      height: 5px;
    }

    .booking-content {
      padding: 1.5rem;
    }

    .booking-description {
      font-size: 1.1rem;
    }

    .cta-section h2 {
      font-size: 1.8rem;
    }
  }
</style>