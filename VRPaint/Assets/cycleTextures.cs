using UnityEngine;
using System.Collections;

public class cycleTextures : MonoBehaviour {
    public Material material;
    public Texture[] textures;
    public int currentTextureIndex = 0;
    public SteamVR_TrackedController leftController;


	// Use this for initialization
	void Start () {
        if (Application.platform == RuntimePlatform.Android)
        {

        } else
        {
            //Steam VR
            leftController.TriggerClicked += switchTexture;
        }

    }
	
	// Update is called once per frame
	void Update () {
	    if (Application.platform == RuntimePlatform.Android)
        {
            if (Input.touches.Length > 0 && Input.touches[0].phase == TouchPhase.Began)
            {
             //   switchTexture(null, new ClickedEventArgs());
            }
        }
	}

    public void switchTexture(object sender, ClickedEventArgs e)
    {
        material.mainTexture = textures[currentTextureIndex];
        currentTextureIndex++;
        currentTextureIndex %= textures.Length;
    }

    public void switchTexture(int index)
    {
        material.mainTexture = textures[index];
        currentTextureIndex = index;
    }
}
