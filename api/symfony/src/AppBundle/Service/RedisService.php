<?php

namespace AppBundle\Service;

use AppBundle\Entity\Computation;
use JMS\Serializer\SerializerInterface;
use Predis\Client;

/**
 * Class RedisService
 * @package AppBundle\Service
 */
class RedisService
{

    /**
     * @var Client
     */
    private $client;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * @var int
     */
    private $timeToLive;

    /**
     * @param $client
     * @param SerializerInterface $serializer
     * @param $timeToLive
     */
    public function __construct(
        $client,
        SerializerInterface $serializer,
        $timeToLive
    ) {
        $this->client = $client;
        $this->serializer = $serializer;
        $this->timeToLive = $timeToLive;
    }

    /**
     * @param $key
     * @param $object
     * @return $this
     */
    public function set($key, $object)
    {
        $jsonObject = $this->serializer->serialize($object, "json");

        $this->client->setex($key, $this->timeToLive, $jsonObject);

        return $this;
    }

    /**
     * @param $key
     * @return array|object
     */
    public function get($key)
    {
        $json = $this->client->get($key);

        if ($json) {
            return $this->serializer->deserialize($json, "", "json");
        }

        return null;
    }

    public function provideKeyForComputation(Computation $computation) {
        $key = sprintf(
            "%s:%s",
            "computation",
            $computation->getHashId()
        );

        return $key;
    }
}
