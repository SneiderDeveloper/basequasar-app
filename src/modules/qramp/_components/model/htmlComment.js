
const modelA = (number) => {
    const html = `
    <div 
      class="
        tw-relative 
        tw-inline-flex 
        tw-items-center
        tw-font-medium 
        tw-text-center 
        tw-rounded-lg 
        hover:bg-blue-800 
        focus:ring-4 
        focus:outline-none 
        focus:ring-blue-300 
        dark:bg-blue-600 
        dark:hover:bg-blue-700 
        dark:focus:ring-blue-800
        tw-text-xl
        tw-cursor-pointer"
      >
      <i
        class="
          fa-light 
          fa-comment-lines 
          tw-pr-1 
          tw-text-red-500 
          tw-font-semibold" 
      ></i>
      <div
        class="
        tw-absolute 
        tw-inline-flex 
        tw-items-center tw-justify-center 
        tw-w-4 
        tw-h-4
        tw-font-bold 
        tw-text-white
        tw-border 
        tw-bg-red-500 
        tw-rounded-full 
        tw--top-1 
        tw--right-2 dark:border-gray-900"
        style="font-size: 7px;"
      >${number}</div>
</div>
`
    return html.toString();
}
export default modelA;