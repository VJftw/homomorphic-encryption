<?php

namespace spec\AppBundle\Service;

use AppBundle\Entity\Computation;
use JMS\Serializer\SerializerInterface;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use \Redis;

/**
 * Class RedisServiceSpec
 * @package spec\AppBundle\Service
 */
class RedisServiceSpec extends ObjectBehavior
{

    function let(
        Redis $client,
        SerializerInterface $serializer
    ) {
        $this->beConstructedWith($client, $serializer, 600);
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('AppBundle\Service\RedisService');
    }

    function it_should_set_a_key_with_expiry(
        Redis $client,
        SerializerInterface $serializer,
        Computation $computation
    ) {
        $jsonObj = [];

        $serializer->serialize($computation, "json")
            ->shouldBeCalled()
            ->willReturn($jsonObj)
        ;

        $client->setex("abcdef", 600, $jsonObj)
            ->shouldBeCalled()
        ;

        $this->set("abcdef", $computation)
            ->shouldReturn($this)
        ;
    }

    function it_should_return_a_key_if_it_exists(
        Redis $client,
        SerializerInterface $serializer,
        Computation $computation
    ) {
        $jsonObj = ["aaa"];
        $client->get("abcdef")
            ->shouldBeCalled()
            ->willReturn($jsonObj)
        ;

        $serializer->deserialize($jsonObj, "", "json")
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $this->get("abcdef")
            ->shouldReturn($computation)
        ;
    }

    function it_should_return_null_if_key_does_not_exist(
        Redis $client
    ) {
        $client->get("abcd")
            ->shouldBeCalled()
            ->willReturn(null)
        ;

        $this->get("abcd")
            ->shouldReturn(null)
        ;
    }

    function it_should_provide_a_key_for_a_computation(
        Computation $computation
    ) {
        $computation->getHashId()
            ->shouldBeCalled()
            ->willReturn("abcde")
        ;

        $this->provideKeyForComputation($computation)
            ->shouldReturn("computation:abcde")
        ;
    }
}
