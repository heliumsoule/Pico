using UnityEngine;
using System.Collections;

public class TextureFetcher : MonoBehaviour {
    public Material material;
	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    //Change this function to append to url format;
    public void fetch(string url)
    {
        url += "/true";
        StartCoroutine(TextureCache.fetch(url, (Texture t) =>
        {
            material.mainTexture = t;
        }));
    }

    public void preFetch(string url)
    {
        url += "/true";
        StartCoroutine(TextureCache.fetch(url, (Texture t) => { 
            // do nothing
        }));
    }
}
