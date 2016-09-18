using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class TextFetcher : MonoBehaviour
{

    // Use this for initialization
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }
    //Change this function to append to url format;
    public void fetch(string url)
    {

        url += "/false";
        StartCoroutine(TextCache.fetch(url, ((List<Neighbor> neighbors) => { })));
    }

    public void fetch(string url, System.Action<System.Collections.Generic.List<Neighbor>> callback)
    {
        url += "/false";
        StartCoroutine(TextCache.fetch(url, callback));
    }
}
