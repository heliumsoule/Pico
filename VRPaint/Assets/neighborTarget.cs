using UnityEngine;
using System.Collections;

public class neighborTarget : MonoBehaviour {
    public ViewManager viewManager;
    public cycleTextures cycleTexture;
    public Neighbor neighbor;
    public Material material;
    public GameObject childObj;
    public int direction;
    Material mat;

    public Color focusColor = new Color(0.9f, 0.2f, 0.2f);
    public Color normalColor = new Color(0.2f, 0.2f, 0.9f, 0.8f);

    public void Start()
    {
        mat = Instantiate(material);
        childObj.GetComponent<Renderer>().material = mat;
        mat.color = normalColor;
    }

    public void onFocus()
    {
        mat.color = focusColor;
    }

    public void onLoseFocus()
    {
        mat.color = normalColor;
    }

    public void onClick()
    {
        /**
        if (neighbor != null)
        {
            viewManager.gotoNeighbor(neighbor);
        } else
        {
            viewManager.textureFetcher.fetch("https://www.ideaspacevr.org/themes/public/assets/user/media/images/VX6EI9yMwsEsmFxGQWwhulQ8xt5w8NGYGjJ2fmIERNq0uccAEpnY1sE6pT2D.jpg");
        }
    */
        cycleTexture.switchTexture(cycleTexture.currentTextureIndex + direction);
    }
}
