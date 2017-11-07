(function() {
	const template = `
		<style>
            
            }
		</style>
		<div>
            <input class="blue" type="text" value="" name="search">
			
            <button>Submit</button>
		</div>		
	`;

	class SearchComponent extends HTMLElement {
		static get observedAttributes() {
            return ['disabled', 'open'];
          }
        
        constructor() {
			super();
			let shadowRoot = this.attachShadow({mode: 'open'});
			shadowRoot.innerHTML = template;
            
           const input = this.shadowRoot.querySelector('input'); input.addEventListener('keypress', function(e){
                if(e.which === 13) {
                    console.log(input.value);
                }
            });
            
            const button = this.shadowRoot.querySelector('button');
            button.addEventListener('click', function(e){
                console.log(input.value);
            })
		}
        
		get value() {
			return this.shadowRoot.querySelector('input').value;     
		}

		set value(value) {
            this.setAttribute("value", value);
            
            return this.shadowRoot.querySelector('input').value = value;
		}
	}

	window.customElements.define('search-input', SearchComponent);
})();

