use web_sys::Element;
use yew::functional::*;
use yew::prelude::*;
use wasm_bindgen::prelude::*;
use gloo_timers::callback::Timeout;
use web_sys::HtmlElement;

#[derive(PartialEq, Properties)]
pub struct MathJaxProps {
    pub children: Html,
}

#[function_component]
pub fn MathJax(props: &MathJaxProps) -> Html {
    let mathjax_ref = use_node_ref();

    {
    let mathjax_ref = mathjax_ref.clone();

    use_effect(move || {
            if let Some(mathjax_el) = mathjax_ref.cast::<HtmlElement>() {
                let some_render_child = get_mjx_element_from_mjx_by_role(&mathjax_el, "render");
                if let Some(render_child) = some_render_child {
                    mathjax_el.remove_child(&render_child);
                }

                let some_data_child = get_mjx_element_from_mjx_by_role(&mathjax_el, "data");
                if let Some(data_child) = some_data_child {

                    let window = web_sys::window().expect("no global `window` exists");
                    let document = window.document().expect("should have a document on window");

                    let render_child = document.create_element("div").unwrap();
                    render_child.set_attribute("data-yew-mjx-role", "render");
                    render_child.set_inner_html(data_child.inner_html().as_str());

                    mathjax_el.append_child(&render_child);

                    let timeout = Timeout::new(100, move || {
                        typeset(vec![render_child]);
                    });
            
                    timeout.forget();
                }
                
            }
        });
    }

    html_nested! {
        <div class="mathjax" ref={mathjax_ref.clone()} >
            <div key={""} data-yew-mjx-role="data" hidden=true>
                { props.children.clone() }
            </div>
        </div>
    }
}

fn get_mjx_element_from_mjx_by_role(mjx : &HtmlElement, role: &str) -> Option<Element> {
    for i in 0..mjx.children().length() {
        // remove mathjax_rendered class children
        let some_child = mjx.children().item(i);
        if let Some(child) = some_child {
            if let Some(r) = child.get_attribute("data-yew-mjx-role") {
                if r == role {
                    return Some(child);
                }
            }
        }
    }

    None
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(el : &str);

    #[wasm_bindgen(js_namespace = MathJax)]
    fn typeset(els : Vec<Element>);
}
