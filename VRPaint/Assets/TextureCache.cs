using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;

public class TextureCache : MonoBehaviour {
    static Dictionary<string, Texture> cache = new Dictionary<string, Texture>();
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
    public static IEnumerator fetch(string url, Action<Texture> callback)
    {
        Debug.Log("fetching image : " + url);
        if (cache.ContainsKey(url))
        {
            callback(cache[url]);
        } else
        {
            WWW www = new WWW(url);
            yield return www;
            cache[url] = www.texture;
            callback(www.texture);
        }
        
    }

}
